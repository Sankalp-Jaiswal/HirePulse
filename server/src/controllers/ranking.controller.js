import { parseExcel } from "../services/excel.service.js";
import { parseGoogleSheet } from "../services/googleSheet.service.js";
import { fetchResume } from "../services/resume.service.js";
import { extractText } from "../services/parser.service.js";
import { rankCandidates } from "../services/ranking.service.js";

const CANDIDATE_PREP_CONCURRENCY = Number(process.env.CANDIDATE_PREP_CONCURRENCY || 4);

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


export const rankCandidatesController = async (req, res) => {
  const { jobDescription, sheetLink } = req.body;

  let candidates = [];

  if (sheetLink) {
    candidates = await parseGoogleSheet(sheetLink);
  } else {
    candidates = parseExcel(req.file.path);
  }

  await mapWithConcurrency(candidates, CANDIDATE_PREP_CONCURRENCY, async (c, index) => {
    const candidateLabel = c.Name || c.Email || c.Resume_Link || `candidate_${index + 1}`;
    c.resumeText = "";

    if (!c.Resume_Link) {
      console.log(`[Resume] [${candidateLabel}] Missing Resume_Link; skipping parse.`);
      return;
    }

    try {
      const { buffer, contentType } = await fetchResume(c.Resume_Link);
      const ct = (contentType || "").toLowerCase();
      if (
        ct.includes("pdf") ||
        ct.includes("officedocument") ||
        ct.includes("msword") ||
        ct.includes("word") ||
        ct.includes("octet-stream")
      ) {
        c.resumeText = await extractText(buffer);
      } else {
        console.log(`[Resume] [${candidateLabel}] Unsupported content-type:`, contentType);
      }
    } catch (err) {
      console.error(`[Resume] [${candidateLabel}] Parse failed:`, err.message);
    }
  });

  const ranked = await rankCandidates(jobDescription, candidates);
  if (ranked.length > 0) {
    console.log("Ranking completed. Sample ranked candidate:", ranked[0].score);
  }
  res.json(ranked);
};
