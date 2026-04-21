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
import CreateField from "../pages/fields/CreateField";
import FieldDetails from "../pages/fields/FieldDetails";
import AssignField from "../pages/fields/AssignField";
import EditField from "../pages/fields/EditField"; // <--- Added this import

import Users from "../pages/users/Users";
import Updates from "../pages/updates/Updates";
import Settings from "../pages/Settings";
import Profile from "../pages/Profile";
import CreateUpdate from "@/pages/updates/CreateUpdate";

/* ================= AUTH GUARD ================= */
const RequireAuth = () => {
  const { user, token } = useAppSelector((state) => state.auth);

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

/* ================= ROLE GUARD ================= */
const RequireRole = ({
  role,
}: {
  role: "admin" | "field_agent";
}) => {
  const { user } = useAppSelector((state) => state.auth);

  if (user?.role !== role) {
    return (
      <Navigate
        to={
          user?.role === "admin"
            ? "/admin/dashboard"
            : "/agent/dashboard"
        }
        replace
      />
    );
  }

  return <Outlet />;
};

/* ================= ROUTER ================= */
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
          
          {/* ================= COMMON ================= */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/createpdates" element={<CreateUpdate />} />


          {/* ================= FIELD ROUTES (SHARED) ================= */}
          <Route path="/fields" element={<Fields />} />
          <Route path="/fields/create" element={<CreateField />} />
          <Route path="/fields/:id" element={<FieldDetails />} />
          <Route path="/fields/:id/edit" element={<EditField />} /> {/* <--- Added this route */}
          <Route path="/fields/:id/assign" element={<AssignField />} />

          {/* ================= ADMIN ================= */}
          <Route element={<RequireRole role="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<Users />} />
          </Route>

          {/* ================= AGENT ================= */}
          <Route element={<RequireRole role="field_agent" />}>
            <Route path="/agent/dashboard" element={<AgentDashboard />} />
          </Route>

        </Route>
      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}