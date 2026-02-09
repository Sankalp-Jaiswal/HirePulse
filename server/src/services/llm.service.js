import OpenAI from "openai";
import { resumeMatchPrompt } from "../prompts/resumeMatch.prompt.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export const evaluateResumeWithJD = async (jd, resume) => {
  const prompt = resumeMatchPrompt({
    jobDescription: jd,
    resumeText: resume
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    temperature: 0.2,
    messages: [{ role: "user", content: prompt }]
  });

  return JSON.parse(response.choices[0].message.content);
};
