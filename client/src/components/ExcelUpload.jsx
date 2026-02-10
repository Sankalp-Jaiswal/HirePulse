import { useState } from "react";
import { rankCandidates } from "../services/ranking.service";
import { useNavigate } from "react-router-dom";

const ExcelUpload = ({jd}) => {
  const [file, setFile] = useState(null);
  const [sheetLink, setSheetLink] = useState("");
//   const [jd, setJD] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    

    setLoading(true);
    const data = await rankCandidates({ jd, file, sheetLink });
    navigate("/results", { state: data });
    setLoading(false);
  };

  return (
    <div className="bg-white p-4 rounded shadow space-y-4">
      <input
        type="file"
        className="block"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <input
        type="text"
        placeholder="Or Google Sheet link"
        className="w-full border rounded p-2"
        onChange={(e) => setSheetLink(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? "Analyzing..." : "Rank Candidates"}
      </button>

      {loading && (
        <p className="text-sm text-gray-600">
          Parsing resumes & scoring candidates. Please wait…
        </p>
      )}
    </div>
  );
};

export default ExcelUpload;
