import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Results from "../pages/Results";
import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Login />} />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/results"
      element={
        <ProtectedRoute>
          <Results />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default AppRoutes;
