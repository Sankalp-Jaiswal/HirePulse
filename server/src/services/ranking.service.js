import { evaluateResumeWithJD } from "./llm.service.js";

export const rankCandidates = async (jd, candidates) => {
  const evaluated = [];

  for (const c of candidates) {
    const result = await evaluateResumeWithJD(jd, c.resumeText);
    evaluated.push({ ...c, ...result });
  }
  
  return evaluated
    .sort((a, b) => b.score - a.score)
    .slice(0, 15)
    .map((c, i) => ({ rank: i + 1, ...c }));
};