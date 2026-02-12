import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { rankCandidates } from "../services/ranking.service";

const ExcelUpload = ({ jd, setCandidates }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [sheetLink, setSheetLink] = useState("https://docs.google.com/spreadsheets/d/1Ple4GoCGH9dQN7Xx9WAewaFN2G1eNrml4rTVnnGHU38/edit?usp=sharing");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if ((!file && !sheetLink) || !jd) return;

    setUploading(true);

    try {
      const response = await rankCandidates({ jd, file, sheetLink });
      // Navigate to results page with ranking data
      navigate("/results", { state: response });
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300">
      <label className="block text-white font-semibold text-lg mb-4">
        Upload Excel File
      </label>
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileChange}
        className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-purple-500/50 transition-all duration-300 mb-4"
      />
      <label className="block text-white font-semibold text-lg mb-4">
        Or Enter Google Sheets Link
      </label>
      <input
        type="text"
        value={sheetLink}
        onChange={(e) => setSheetLink(e.target.value)}
        placeholder="https://docs.google.com/spreadsheets/d/..."
        className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-purple-500/50 transition-all duration-300 mb-4"
      />
      <button
        onClick={handleUpload}
        disabled={(!file && !sheetLink) || !jd || uploading}
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
      >
        {uploading ? "Uploading..." : "Upload & Rank"}
      </button>
    </div>
  );
};

export default ExcelUpload;
