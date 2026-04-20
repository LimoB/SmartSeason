import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "./hooks";

// Layouts
import AuthLayout from "../layouts/AuthLayout";
import MainLayout from "../layouts/MainLayout";

// Pages
import LandingPage from "../pages/LandingPage";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Dashboards
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import AgentDashboard from "../pages/dashboard/AgentDashboard";

// Core Pages
import Fields from "../pages/fields/Fields";
import Users from "../pages/users/Users";
import Updates from "../pages/updates/Updates";
import Settings from "../pages/Settings";
import Profile from "../pages/Profile";

/* ===============================
   AUTH GUARD
================================ */
const RequireAuth = () => {
  const { user, token } = useAppSelector((state) => state.auth);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

/* ===============================
   ROLE GUARD
================================ */
const RequireRole = ({ role }: { role: "admin" | "field_agent" }) => {
  const { user } = useAppSelector((state) => state.auth);

  if (user?.role !== role) {
    return (
      <Navigate
        to={user?.role === "admin" ? "/admin/dashboard" : "/agent/dashboard"}
        replace
      />
    );
  }

  return <Outlet />;
};

/* ===============================
   ROUTER
================================ */
export default function AppRouter() {
  return (
    <Routes>

      {/* ================= PUBLIC ================= */}
      <Route path="/" element={<LandingPage />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ================= PROTECTED ================= */}
      <Route element={<RequireAuth />}>
        
        <Route element={<MainLayout />}>

          {/* ================= COMMON ROUTES ================= */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/updates" element={<Updates />} />

          {/* ================= ADMIN ================= */}
          <Route element={<RequireRole role="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/fields" element={<Fields />} />
            <Route path="/admin/users" element={<Users />} />
          </Route>

          {/* ================= AGENT ================= */}
          <Route element={<RequireRole role="field_agent" />}>
            <Route path="/agent/dashboard" element={<AgentDashboard />} />
            <Route path="/agent/fields" element={<Fields />} />
          </Route>

        </Route>

      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}