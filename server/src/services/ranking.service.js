import { evaluateResumeWithJD } from "./llm.service.js";

const RANK_EVAL_CONCURRENCY = Number(process.env.RANK_EVAL_CONCURRENCY || 4);

const mapWithConcurrency = async (items, limit, mapper) => {
  const results = new Array(items.length);
  let nextIndex = 0;

  const worker = async () => {
    while (true) {
      const current = nextIndex++;
      if (current >= items.length) return;
      results[current] = await mapper(items[current], current);
    }
  };

  const workerCount = Math.min(Math.max(limit, 1), items.length || 1);
  await Promise.all(Array.from({ length: workerCount }, worker));
  return results;
};

export const rankCandidates = async (jd, candidates) => {
  const evaluated = await mapWithConcurrency(candidates, RANK_EVAL_CONCURRENCY, async (c) => {
    const result = await evaluateResumeWithJD(
      jd,
      c.resumeText,
      c.Demo_Video_Link,
    );
    return { ...c, ...result };
  });
  
  return evaluated
    .sort((a, b) => b.score - a.score)
    .slice(0, 15)
    .map((c, i) => ({ rank: i + 1, ...c }));
};
