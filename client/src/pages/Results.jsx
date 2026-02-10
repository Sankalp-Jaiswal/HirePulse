import { useLocation, Navigate } from "react-router-dom";
import RankingTable from "../components/RankingTable";

const Results = () => {
  const { state } = useLocation(); 
  console.log(state);
  

  if (!state) return <Navigate to="/dashboard" replace />;

  return <RankingTable data={state} />;
};
export default Results;