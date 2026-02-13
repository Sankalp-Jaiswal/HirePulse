import { useState } from "react";
import Layout from "../components/Layout";
import JDInput from "../components/JDInput";
import ExcelUpload from "../components/ExcelUpload";

const Dashboard = () => {
  const [jd, setJD] = useState(" ");
  const [candidates, setCandidates] = useState([]);

  return (
    <Layout>
  <h2 className="text-2xl font-semibold mb-4 text-white">
    Job Description & Candidate Data
  </h2>

      <div className="space-y-6">
        <JDInput setJD={setJD} />
        <ExcelUpload jd={jd} setCandidates={setCandidates} />
      </div>
    </Layout>
  );
};

export default Dashboard;
