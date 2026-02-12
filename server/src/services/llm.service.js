import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Summarizes resume text to extract only relevant information
 * This reduces token count and speeds up processing
 */
const extractRelevantResumeInfo = (resumeText, jobDescription) => {
  // Extract key sections more efficiently
  const lines = resumeText.split('\n').filter(line => line.trim());
  
  // Focus on skills, experience, education - ignore verbose descriptions
  const relevantSections = {
    skills: [],
    experience: [],
    education: []
  };
  
  let currentSection = null;
  
  for (const line of lines) {
    const lower = line.toLowerCase();
    
    // Detect section headers
    if (lower.includes('skill') || lower.includes('technical')) {
      currentSection = 'skills';
      continue;
    } else if (lower.includes('experience') || lower.includes('work') || lower.includes('employment')) {
      currentSection = 'experience';
      continue;
    } else if (lower.includes('education') || lower.includes('qualification')) {
      currentSection = 'education';
      continue;
    }
    
    // Add content to appropriate section (limit length)
    if (currentSection && line.length > 5) {
      relevantSections[currentSection].push(line);
    }
  }
  
  // Build condensed resume (max 500 words)
  let condensed = '';
  
  if (relevantSections.skills.length > 0) {
    condensed += 'Skills: ' + relevantSections.skills.slice(0, 10).join(', ') + '\n\n';
  }
  
  if (relevantSections.experience.length > 0) {
    condensed += 'Experience: ' + relevantSections.experience.slice(0, 15).join(' | ') + '\n\n';
  }
  
  if (relevantSections.education.length > 0) {
    condensed += 'Education: ' + relevantSections.education.slice(0, 5).join(' | ');
  }
  
  // If extraction failed, take first 800 characters
  if (condensed.length < 100) {
    condensed = resumeText.substring(0, 800);
  }
  
  return condensed.trim();
};

/**
 * Summarizes video transcript to key points
 */
const extractKeyTranscriptPoints = (transcript) => {
  if (!transcript || transcript.length < 50) {
    return transcript || "No transcript provided";
  }
  
  // Take first and last portions + middle sample
  const words = transcript.split(' ');
  const totalWords = words.length;
  
  if (totalWords <= 200) {
    return transcript;
  }
  
  // Smart sampling: first 100 words, middle 50, last 50
  const start = words.slice(0, 100).join(' ');
  const middle = words.slice(Math.floor(totalWords / 2) - 25, Math.floor(totalWords / 2) + 25).join(' ');
  const end = words.slice(-50).join(' ');
  
  return `${start}... ${middle}... ${end}`;
};

/**
 * Optimized evaluation function with reduced token usage
 */
export const evaluateResumeWithJD = async (
  jobDescription,
  resumeText,
  // videoTranscript,
  retryCount = 0,
) => {
  // Validation
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY missing in .env");
  }

  // 🚀 OPTIMIZATION 1: Condense inputs to reduce tokens
  const condensedResume = extractRelevantResumeInfo(resumeText, jobDescription);
  // const condensedTranscript = extractKeyTranscriptPoints(videoTranscript);
  
  // Take only first 400 chars of JD (key requirements)
  const condensedJD = jobDescription.length > 400 
    ? jobDescription.substring(0, 400) + "..." 
    : jobDescription;

  // 🚀 OPTIMIZATION 2: Simplified, directive prompt
  // Video: ${condensedTranscript}
  const prompt = `ATS Evaluation:

JD: ${condensedJD}

Resume: ${condensedResume}



Score 0-100 based on: 90% resume match, 10% communication quality.
Return JSON only:
{"score": <number>(0-100), "reason": "<max 20 words>"}`;

  try {
    // 🚀 OPTIMIZATION 3: Use faster model with optimized config
    const model = client.getGenerativeModel({
      model: "gemini-2.0-flash", // Faster experimental model
      generationConfig: { 
        responseMimeType: "application/json",
        temperature: 0.1, // Lower = faster, more consistent
        maxOutputTokens: 100, // Limit response length
        topP: 0.8,
        topK: 20
      },
    });

    // 🚀 OPTIMIZATION 4: Set timeout to fail fast
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout')), 10000) // 10s timeout
    );
    
    const generationPromise = model.generateContent(prompt);
    
    const result = await Promise.race([generationPromise, timeoutPromise]);
    
    let text = result.response.text();
    text = text.replace(/```json|```/g, "").trim();

    let parsed = JSON.parse(text);

    // Safety: Handle array responses
    if (Array.isArray(parsed)) {
      parsed = parsed[0];
    }

    return {
      score: Number(parsed.score) || 0,
      reason: String(parsed.reason || "No justification provided").substring(0, 150), // Cap reason length
    };
    
  } catch (error) {
    console.error("Gemini API error:", error.message);
    
    // 🚀 OPTIMIZATION 5: Smart retry logic
    if (retryCount < 2 && (error.message.includes('Timeout') || error.message.includes('429'))) {
      console.log(`Retrying... Attempt ${retryCount + 1}`);
      await new Promise(res => setTimeout(res, 1000 * (retryCount + 1))); // Exponential backoff
      // return evaluateResumeWithJD(jobDescription, resumeText, videoTranscript, retryCount + 1);
      return evaluateResumeWithJD(jobDescription, resumeText, retryCount + 1);
    }
    
    return {
      score: 0,
      reason: "Evaluation failed due to API limits or connectivity.",
    };
  }
};

/**
 * OPTIONAL: Batch evaluation function for processing multiple candidates faster
 */
export const batchEvaluateResumes = async (jobDescription, candidates) => {
  // Process in parallel batches of 3 to avoid rate limits
  const batchSize = 3;
  const results = [];
  
  for (let i = 0; i < candidates.length; i += batchSize) {
    const batch = candidates.slice(i, i + batchSize);
    const batchPromises = batch.map(candidate => 
      evaluateResumeWithJD(jobDescription, candidate.resumeText, candidate.videoTranscript)
    );
    
    const batchResults = await Promise.allSettled(batchPromises);
    results.push(...batchResults.map(r => r.status === 'fulfilled' ? r.value : { score: 0, reason: 'Failed' }));
    
    // Small delay between batches
    if (i + batchSize < candidates.length) {
      await new Promise(res => setTimeout(res, 500));
    }
  }
  
  return results;
};



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




// import { GoogleGenerativeAI } from "@google/generative-ai";

// const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // Helper function to handle the wait
// const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// export const evaluateResumeWithJD = async (
//   jobDescription,
//   resumeText,
//   videoTranscript,
//   retryCount = 0,
// ) => {
//   if (!process.env.GEMINI_API_KEY) {
//     throw new Error("GEMINI_API_KEY missing in .env");
//   }
//   if (!process.env.GEMINI_API_KEY) {
//     return res.status(500).json({ error: "API KEY NOT FOUND" });
//   }

//   const prompt = `
//     You are an advanced ATS system.

// Evaluate candidate based on:

// 1. Resume (technical skills & experience)
// 2. Demo video transcript (communication clarity, confidence, understanding)

// Job Description:
// ${jobDescription}

// Resume:
// ${resumeText}

// Video Transcript:
// ${videoTranscript}

// Scoring Rules:
// - 70% weight: Resume relevance
// - 30% weight: Communication & explanation clarity

// STRICT RULES:
// - Return ONLY ONE JSON OBJECT
// - Do NOT return an array
// - Do NOT add explanations

// Format:
// {
//   "score": number(0-100),
//   "reason": string(justification for the score, max 2 sentences)
// }
//   `;

//   try {
//     // Using 'gemini-2.0-flash' which is the current stable-ish identifier
//     const model = client.getGenerativeModel({
//       model: "gemini-2.5-flash",
//       generationConfig: { responseMimeType: "application/json" },
//     });

//     const result = await model.generateContent(prompt);
//     let text = result.response.text();

//     text = text.replace(/```json|```/g, "").trim();

//     let parsed = JSON.parse(text);

//     // 🔥 HARD SAFETY
//     if (Array.isArray(parsed)) {
//       parsed = parsed[0];
//     }

//     return {
//       score: Number(parsed.score) || 0,
//       reason: String(parsed.reason || "No justification provided"),
//     };
//   } catch (error) {
//     console.error("Gemini API error:", error.message);
//     return {
//       score: 0,
//       reason: "Evaluation failed due to API limits or connectivity.",
//     };
//   }
// };
