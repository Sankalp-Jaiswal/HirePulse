import { parseExcel } from "../services/excel.service.js";
import { parseGoogleSheet } from "../services/googleSheet.service.js";
import { fetchResume } from "../services/resume.service.js";
import { extractText } from "../services/parser.service.js";
import { rankCandidates } from "../services/ranking.service.js";

export const rankCandidatesController = async (req, res) => {
  const { jobDescription, sheetLink } = req.body;
  

  let candidates = [];

  if (sheetLink) {
    candidates = await parseGoogleSheet(sheetLink);
  } else {
    candidates = parseExcel(req.file.path);
  }
  
  for (const c of candidates) {
    try {
      const { buffer, contentType } = await fetchResume(c.Resume_Link);

      // Accept PDF, Word docs, and octet-stream (Google Drive exports)
      const ct = (contentType || "").toLowerCase();
      if (ct.includes("pdf") || ct.includes("officedocument") || ct.includes("msword") || ct.includes("word") || ct.includes("octet-stream")) {
        c.resumeText = await extractText(buffer);
      } else {
        console.log("Skipping resume parsing, unsupported content-type:", contentType);
        c.resumeText = "";
      }
    } catch (err) {
      console.error("Resume parsing failed:", err.message);
      c.resumeText = "";
    }
  }

  const ranked = await rankCandidates(jobDescription, candidates);
  console.log("Ranking completed. Sample ranked candidate:", ranked[0].score);
  res.json(ranked);
};
