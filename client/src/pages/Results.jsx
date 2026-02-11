import { useLocation, Navigate, Link } from "react-router-dom";
import Layout from "../components/Layout";
import RankingTable from "../components/RankingTable";

const Results = () => {
  const { state } = useLocation();
  console.log(state);


  if (!state) return <Navigate to="/dashboard" replace />;
  if (!Array.isArray(state)) {
    return (
      <Layout>
        <div className="text-red-300 bg-red-900/30 border border-red-700/40 rounded-lg p-4">
          Failed to load ranking results. Please try again.
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <Link
          to="/dashboard"
          className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
        >
          Go to Dashboard
        </Link>
        <RankingTable data={state} />
      </div>
    </Layout>
  );
};
export default Results;
