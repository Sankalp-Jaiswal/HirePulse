import { useLocation, Navigate } from "react-router-dom";

const Results = () => {
  const { state } = useLocation();

  if (!state) return <Navigate to="/dashboard" replace />;

  return <RankingTable data={state} />;
};
export default Results;