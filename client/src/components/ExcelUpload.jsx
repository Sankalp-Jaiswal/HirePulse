import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { rankCandidates } from "../services/ranking.service";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const CircularProgress = ({ progress }) => {
  const size = 22;
  const stroke = 2.5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeProgress = clamp(progress, 0, 100);
  const offset = circumference - (safeProgress / 100) * circumference;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="rgba(255,255,255,0.25)"
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="white"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
};

const ExcelUpload = ({ jd, setCandidates }) => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [sheetLink, setSheetLink] = useState(
    " ",
  );
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const animationRef = useRef(null);

  useEffect(() => {
    if (!uploading) {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    animationRef.current = setInterval(() => {
      setProgress((current) => {
        if (current >= 95) return current;
        if (current < 70) return current + 2;
        return current + 1;
      });
    }, 250);

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [uploading]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if ((!file && !sheetLink) || !jd) return;

    setProgress(5);
    setUploading(true);

    try {
      const response = await rankCandidates({
        jd,
        file,
        sheetLink,
        onUploadProgress: (event) => {
          if (!event?.total) return;
          const uploadPercent = Math.round((event.loaded / event.total) * 70);
          setProgress((current) => Math.max(current, clamp(uploadPercent, 5, 70)));
        },
      });

      setProgress(100);
      await new Promise((resolve) => setTimeout(resolve, 250));
      // Navigate to results page with ranking data
      navigate("/results", { state: response });
    } catch (error) {
      console.error("Upload failed:", error);
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300">
      <label className="block text-white font-semibold text-lg mb-4">Upload Excel File</label>
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
      <div className="mt-2 flex items-center justify-center">
        <button
          onClick={handleUpload}
          disabled={(!file && !sheetLink) || !jd || uploading}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none min-w-[340px] inline-flex items-center justify-center gap-3 text-base font-semibold"
        >
          {uploading ? (
            <span className="flex  items-center justify-center gap-4">
              <CircularProgress progress={progress} />
              <span>
                {progress < 85
                  ? `Uploading... ${Math.round(progress)}%`
                  : `Finalizing results... ${Math.round(progress)}%`}
              </span>
            </span>
          ) : (
            <span>Upload & Rank</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ExcelUpload;
