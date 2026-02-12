import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from "fs/promises";
import { downloadDriveVideo, extractAudioFromVideo } from "./speech.service.js";

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
const audioScoreCache = new Map();

const resumeModel = client.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.1,
    maxOutputTokens: 100,
    topP: 0.8,
    topK: 20,
  },
});

const audioModel = client.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    responseMimeType: "application/json",
    temperature: 0.1,
    maxOutputTokens: 80,
  },
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const extractRelevantResumeInfo = (resumeText) => {
  const lines = String(resumeText || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const relevantSections = {
    skills: [],
    experience: [],
    education: [],
  };

  let currentSection = null;
  for (const line of lines) {
    const lower = line.toLowerCase();
    if (lower.includes("skill") || lower.includes("technical")) {
      currentSection = "skills";
      continue;
    }
    if (
      lower.includes("experience") ||
      lower.includes("work") ||
      lower.includes("employment")
    ) {
      currentSection = "experience";
      continue;
    }
    if (lower.includes("education") || lower.includes("qualification")) {
      currentSection = "education";
      continue;
    }
    if (currentSection && line.length > 5) {
      relevantSections[currentSection].push(line);
    }
  }

  let condensed = "";
  if (relevantSections.skills.length > 0) {
    condensed += `Skills: ${relevantSections.skills.slice(0, 10).join(", ")}\n\n`;
  }
  if (relevantSections.experience.length > 0) {
    condensed += `Experience: ${relevantSections.experience
      .slice(0, 15)
      .join(" | ")}\n\n`;
  }
  if (relevantSections.education.length > 0) {
    condensed += `Education: ${relevantSections.education.slice(0, 5).join(" | ")}`;
  }

  if (condensed.length < 100) {
    condensed = String(resumeText || "").substring(0, 800);
  }

  return condensed.trim();
};

const parseJsonObject = (text) => {
  const cleaned = String(text || "").replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(cleaned);
  return Array.isArray(parsed) ? parsed[0] : parsed;
};

const withTimeout = (promise, timeoutMs, message = "Timeout") =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(message)), timeoutMs)),
  ]);

const analyzeAudio = async (audioPath) => {
  const uploadResult = await fileManager.uploadFile(audioPath, {
    mimeType: "audio/wav",
    displayName: "Interview Audio",
  });

  let file = await fileManager.getFile(uploadResult.file.name);
  while (file.state === "PROCESSING") {
    await sleep(900);
    file = await fileManager.getFile(uploadResult.file.name);
  }
  if (file.state !== "ACTIVE") {
    throw new Error(`Audio file processing failed: ${file.state}`);
  }

  const result = await withTimeout(
    audioModel.generateContent([
      {
        fileData: {
          mimeType: file.mimeType,
          fileUri: file.uri,
        },
      },
      {
        text: 'Analyze communication quality. Return JSON only: {"audio_score": <number>(0-100), "a_reason": "<max 10 words>"}',
      },
    ]),
    20000,
    "Audio analysis timeout",
  );

  const parsed = parseJsonObject(result.response.text());
  return {
    score: Number(parsed.audio_score) || 0,
    reason: String(parsed.a_reason || ""),
  };
};

const getAudioScoreFromDriveLink = async (driveLink) => {
  if (!driveLink) return { score: 0, reason: "" };
  if (audioScoreCache.has(driveLink)) return audioScoreCache.get(driveLink);

  let videoPath = "";
  let audioPath = "";

  try {
    videoPath = await downloadDriveVideo(driveLink);
    audioPath = await extractAudioFromVideo(videoPath);
    const audioData = await analyzeAudio(audioPath);
    audioScoreCache.set(driveLink, audioData);
    return audioData;
  } finally {
    if (videoPath) {
      await fs.unlink(videoPath).catch(() => {});
    }
    if (audioPath) {
      await fs.unlink(audioPath).catch(() => {});
    }
  }
};

const evaluateResumeOnly = async (jobDescription, resumeText, retryCount = 0) => {
  const condensedResume = extractRelevantResumeInfo(resumeText);
  const jd = String(jobDescription || "");
  const condensedJD = jd.length > 400 ? `${jd.substring(0, 400)}...` : jd;

  const prompt = `ATS Evaluation:

JD: ${condensedJD}

Resume: ${condensedResume}

Score 0-100 based on resume match with the job description.
Return JSON only:
{"resume_score": <number>(0-100), "reason": "<max 20 words>"}`;

  try {
    const result = await withTimeout(
      resumeModel.generateContent(prompt),
      10000,
      "Resume analysis timeout",
    );
    const parsed = parseJsonObject(result.response.text());
    return {
      score: Number(parsed.resume_score) || 0,
      reason: String(parsed.reason || "No justification provided"),
    };
  } catch (error) {
    if (retryCount < 2 && /Timeout|429/.test(error.message || "")) {
      await sleep(1000 * (retryCount + 1));
      return evaluateResumeOnly(jobDescription, resumeText, retryCount + 1);
    }
    throw error;
  }
};

export const evaluateResumeWithJD = async (
  jobDescription,
  resumeText,
  Demo_Video_Link,
) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY missing in .env");
  }

  if (!resumeText && !Demo_Video_Link) {
    return {
      score: 0,
      reason: "No resume or video data provided.",
    };
  }

  try {
    const [resumeData, audioData] = await Promise.all([
      evaluateResumeOnly(jobDescription, resumeText).catch((error) => {
        console.error("Resume scoring failed:", error.message);
        return { score: 0, reason: "Resume scoring unavailable." };
      }),
      Demo_Video_Link
        ? getAudioScoreFromDriveLink(Demo_Video_Link).catch((error) => {
            console.error("Audio scoring failed:", error.message);
            return { score: 0, reason: "" };
          })
        : Promise.resolve({ score: 0, reason: "" }),
    ]);

    const reason = `${resumeData.reason}`.trim().substring(0, 150)+` ${audioData.reason}`
    return {
      score: 0.7 * resumeData.score + 0.3 * audioData.score || 0,
      reason: reason || "No justification provided",
    };
  } catch (error) {
    console.error("Gemini API error:", error.message);
    return {
      score: 0,
      reason: "Evaluation failed due to API limits or connectivity.",
    };
  }
};

export const batchEvaluateResumes = async (jobDescription, candidates) => {
  const batchSize = 4;
  const results = [];

  for (let i = 0; i < candidates.length; i += batchSize) {
    const batch = candidates.slice(i, i + batchSize);
    const batchPromises = batch.map((candidate) =>
      evaluateResumeWithJD(
        jobDescription,
        candidate.resumeText,
        candidate.Demo_Video_Link,
      ),
    );

    const batchResults = await Promise.allSettled(batchPromises);
    results.push(
      ...batchResults.map((result) =>
        result.status === "fulfilled" ? result.value : { score: 0, reason: "Failed" },
      ),
    );

    if (i + batchSize < candidates.length) {
      await sleep(350);
    }
  }

  return results;
};
