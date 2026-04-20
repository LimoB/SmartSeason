import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  LayoutDashboard,
  Home,
  LogOut,
  Settings,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/features/auth/authSlice";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // ================= INITIALS =================
  const initials =
    user?.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  // ================= DASHBOARD ROUTE =================
  const getDashboardRoute = () => {
    switch (user?.role) {
      case "admin":
        return "/admin/dashboard";
      case "field_agent":
        return "/agent/dashboard";
      default:
        return "/";
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ================= CLOSE OUTSIDE =================
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="
      fixed top-0 left-0 w-full z-50
      bg-white/90 dark:bg-dark-bg/90 backdrop-blur-md
      border-b border-gray-200 dark:border-dark-border
      text-gray-800 dark:text-gray-100
    ">

      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* ================= LEFT ================= */}
        <div className="flex items-center gap-10">

          <h1 className="text-xl font-bold text-primary-500 tracking-tight">
            SmartSeason
          </h1>

          <div className="hidden md:flex items-center gap-6 text-sm text-gray-500 dark:text-gray-300">

            <Link to="/" className="flex items-center gap-1 hover:text-primary-500 transition">
              <Home size={16} /> Home
            </Link>

            <a href="#services" className="hover:text-primary-500 transition">
              Services
            </a>

            <a href="#about" className="hover:text-primary-500 transition">
              About
            </a>

            <a href="#contact" className="hover:text-primary-500 transition">
              Contact
            </a>

          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex items-center gap-4">

          {!user ? (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-primary-500 transition"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="
                  px-4 py-2 rounded-lg
                  bg-primary-500 text-white
                  hover:bg-primary-600
                  shadow-sm hover:shadow-md
                  transition
                "
              >
                Get Started
              </Link>
            </>
          ) : (
            <div className="relative" ref={menuRef}>

              {/* ================= AVATAR ================= */}
              <button
                onClick={() => setOpen(!open)}
                className="
                  flex items-center gap-3 px-3 py-2
                  rounded-full
                  bg-gray-100 dark:bg-dark-surface
                  border border-gray-200 dark:border-dark-border
                  hover:shadow-md hover:ring-2 hover:ring-primary-500/30
                  transition
                "
              >
                <div className="
                  w-9 h-9 bg-primary-500
                  rounded-full flex items-center justify-center
                  text-white text-sm font-bold
                  shadow-sm
                ">
                  {initials}
                </div>

                <span className="text-sm font-medium hidden md:block">
                  {user.fullName.split(" ")[0]}
                </span>
              </button>

              {/* ================= DROPDOWN ================= */}
              {open && (
                <div className="
                  absolute right-0 mt-3 w-56
                  bg-white dark:bg-dark-surface
                  border border-gray-200 dark:border-dark-border
                  rounded-2xl shadow-xl overflow-hidden
                  animate-fade-in
                ">

                  <button
                    onClick={() => {
                      navigate("/profile");
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-dark-surface2 transition"
                  >
                    <User size={16} /> Profile
                  </button>

                  <button
                    onClick={() => {
                      navigate(getDashboardRoute());
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-dark-surface2 transition"
                  >
                    <LayoutDashboard size={16} /> Dashboard
                  </button>

                  <button
                    onClick={() => {
                      navigate("/settings");
                      setOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-dark-surface2 transition"
                  >
                    <Settings size={16} /> Settings
                  </button>

                  <div className="border-t border-gray-200 dark:border-dark-border" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                  >
                    <LogOut size={16} /> Logout
                  </button>

                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}