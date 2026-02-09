export const rankCandidatesController = async (req, res) => {
  const { jobDescription, sheetLink } = req.body;

  let candidates = [];

  if (sheetLink) {
    candidates = await parseGoogleSheet(sheetLink);
  } else {
    candidates = parseExcel(req.file.path);
  }

  for (const c of candidates) {
    const buffer = await fetchResume(c.Resume_Link);
    c.resumeText = await extractText(buffer);
  }

  const ranked = await rankCandidates(jobDescription, candidates);
  res.json(ranked);
};
