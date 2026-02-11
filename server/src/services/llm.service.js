// import OpenAI from "openai";
// import { resumeMatchPrompt } from "../prompts/resumeMatch.prompt.js";

// console.log(process.env.OPENAI_API_KEY);

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// export const evaluateResumeWithJD = async (jd, resume) => {
//   const prompt = resumeMatchPrompt({
//     jobDescription: jd,
//     resumeText: resume
//   });

//   const response = await openai.chat.completions.create({
//     model: "gpt-4o",
//     temperature: 0.2,
//     messages: [{ role: "user", content: prompt }]
//   });

//   return JSON.parse(response.choices[0].message.content);
// };

import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to handle the wait
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export const evaluateResumeWithJD = async (
  jobDescription,
  resumeText,
  retryCount = 0,
) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY missing in .env");
  }

  const prompt = `
    You are an ATS system.

Job Description:
${jobDescription}

Candidate Resume:
${resumeText}

STRICT RULES:
- Return ONLY ONE JSON OBJECT
- Do NOT return an array
- Do NOT add explanations

Format:
{
  "score": number(0-100),
  "reason": string(justification for the score, max 2 sentences)
}
  `;

  try {
    // Using 'gemini-2.0-flash' which is the current stable-ish identifier
    const model = client.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    text = text.replace(/```json|```/g, "").trim();

    let parsed = JSON.parse(text);

    // 🔥 HARD SAFETY
    if (Array.isArray(parsed)) {
      parsed = parsed[0];
    }

    
    return {
      score: Number(parsed.score) || 0,
      reason: String(parsed.reason || "No justification provided"),
    };
  } catch (error) {
    console.error("Gemini API error:", error.message);
    return {
      score: 0,
      reason: "Evaluation failed due to API limits or connectivity.",
    };
  }
};
