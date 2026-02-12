import api from "./api";

export const rankCandidates = async ({
  jd,
  file,
  sheetLink,
  onUploadProgress,
  onDownloadProgress,
}) => {
  const formData = new FormData();
  formData.append("jobDescription", jd);
  

  if (file) formData.append("excel", file);
  if (sheetLink) formData.append("sheetLink", sheetLink);

  const token = localStorage.getItem("google_token");
  // console.log("Token in localStorage:", token ? "✓ Exists" : "✗ Missing");
  
  const res = await api.post("/api/rank", formData, {
    onUploadProgress,
    onDownloadProgress,
  });
  
  return res.data;
};
