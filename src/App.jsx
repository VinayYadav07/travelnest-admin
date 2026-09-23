import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

// Check if admin is logged in
const CheckLogin = ({ children }) => {
  const adminLoginToken = localStorage.getItem("adminLoginToken");

  // If admin is not logged in, go to login page
  if (!adminLoginToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Main app component
const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <CheckLogin>
            <AdminDashboard />
          </CheckLogin>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
