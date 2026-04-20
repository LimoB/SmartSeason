import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Tractor,
  ClipboardList,
  Users,
  Menu,
  X,
} from "lucide-react";

import { useAppSelector } from "@/app/hooks";

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  const user = useAppSelector((state) => state.auth.user);

  const isAdmin = user?.role === "admin";

  // ================= ROUTES =================
  const dashboardPath = isAdmin
    ? "/admin/dashboard"
    : "/agent/dashboard";

  const fieldsPath = isAdmin
    ? "/admin/fields"
    : "/agent/fields";

  const updatesPath = "/updates";

  const usersPath = "/admin/users";

  // ================= ACTIVE STYLE =================
  const linkClass = ({ isActive }: { isActive: boolean }) => `
    group flex items-center gap-3 px-4 py-2.5 rounded-xl
    text-sm font-medium transition-all duration-200

    ${
      isActive
        ? "bg-primary-500 text-white shadow-md"
        : "text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-surface"
    }
  `;

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen z-50
        bg-white dark:bg-dark-bg
        border-r border-gray-200 dark:border-dark-border
        transition-all duration-300 ease-in-out
        ${open ? "w-64" : "w-20"}
      `}
    >

      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-dark-border">

        {open && (
          <div className="leading-tight">
            <h1 className="text-lg font-bold text-primary-500">
              SmartSeason
            </h1>
            <p className="text-xs text-gray-400">
              Agriculture System
            </p>
          </div>
        )}

        <button
          onClick={() => setOpen(!open)}
          className="
            p-2 rounded-lg
            hover:bg-gray-100 dark:hover:bg-dark-surface
            transition
          "
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* ================= MENU ================= */}
      <nav className="mt-5 flex flex-col gap-2 px-2">

        {/* DASHBOARD */}
        <NavLink to={dashboardPath} className={linkClass}>
          <LayoutDashboard size={20} />
          {open && "Dashboard"}
        </NavLink>

        {/* FIELDS */}
        <NavLink to={fieldsPath} className={linkClass}>
          <Tractor size={20} />
          {open && "Fields"}
        </NavLink>

        {/* UPDATES */}
        <NavLink to={updatesPath} className={linkClass}>
          <ClipboardList size={20} />
          {open && "Updates"}
        </NavLink>

        {/* USERS (ADMIN ONLY) */}
        {isAdmin && (
          <NavLink to={usersPath} className={linkClass}>
            <Users size={20} />
            {open && "Users"}
          </NavLink>
        )}

      </nav>

      {/* ================= FOOTER ================= */}
      {open && (
        <div className="absolute bottom-4 px-4 text-xs text-gray-400 space-y-1">
          <p className="font-medium">SmartSeason v1.0</p>
          <p className="opacity-70">
            Field Monitoring System
          </p>
        </div>
      )}

    </aside>
  );
}