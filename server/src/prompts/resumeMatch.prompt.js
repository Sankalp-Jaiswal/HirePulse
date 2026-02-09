export const resumeMatchPrompt = ({ jobDescription, resumeText }) => `
You are an ATS system.

Job Description:
${jobDescription}

Candidate Resume:
${resumeText}

Return ONLY valid JSON:
{
  "score": number,
  "reason": string
}
`;
