import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  User,
  LayoutDashboard,
  Home,
  LogOut,
  Settings,
  Menu,
  X,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/features/auth/authSlice";
import ThemeToggle from "@/components/ui/ThemeToggle";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);

  const [open, setOpen] = useState(false); // For user profile dropdown
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // For mobile nav
  const menuRef = useRef<HTMLDivElement>(null);

  const initials =
    user?.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  // Navigation Logic for Scrolling
  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false); // Close mobile menu if open

    if (location.pathname !== "/") {
      // If not on landing page, navigate home then scroll
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      // Already home, just scroll
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getDashboardRoute = () => {
    switch (user?.role) {
      case "admin": return "/admin/dashboard";
      case "field_agent": return "/agent/dashboard";
      default: return "/";
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/login");
  };

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
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-dark-border text-gray-800 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* LEFT: Logo & Nav Links */}
        <div className="flex items-center gap-10">
          <button 
            onClick={() => scrollToSection("home")}
            className="text-xl font-bold text-primary-500 tracking-tight"
          >
            SmartSeason
          </button>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500 dark:text-gray-300">
            <button onClick={() => scrollToSection("home")} className="hover:text-primary-500 transition flex items-center gap-1">
              <Home size={16} /> Home
            </button>
            <button onClick={() => scrollToSection("services")} className="hover:text-primary-500 transition">Services</button>
            <button onClick={() => scrollToSection("about")} className="hover:text-primary-500 transition">About</button>
            <button onClick={() => scrollToSection("contact")} className="hover:text-primary-500 transition">Contact</button>
          </div>
        </div>

        {/* RIGHT: Actions & Profile */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {!user ? (
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-primary-500 transition">
                Login
              </Link>
              <Link to="/register" className="px-5 py-2.5 rounded-xl bg-primary-500 text-white font-bold text-sm hover:bg-primary-600 transition shadow-lg shadow-primary-500/20">
                Get Started
              </Link>
            </div>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3 px-2 py-1 rounded-full bg-gray-100 dark:bg-dark-surface hover:ring-2 hover:ring-primary-500/30 transition"
              >
                <div className="w-9 h-9 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-inner">
                  {initials}
                </div>
                <span className="text-sm font-semibold hidden md:block pr-2">
                  {user.fullName.split(" ")[0]}
                </span>
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-dark-surface rounded-2xl shadow-2xl border border-gray-100 dark:border-dark-border py-2 animate-in fade-in slide-in-from-top-2">
                  <DropdownItem icon={<User size={16} />} onClick={() => { navigate("/profile"); setOpen(false); }}>Profile</DropdownItem>
                  <DropdownItem icon={<LayoutDashboard size={16} />} onClick={() => { navigate(getDashboardRoute()); setOpen(false); }}>Dashboard</DropdownItem>
                  <DropdownItem icon={<Settings size={16} />} onClick={() => { navigate("/settings"); setOpen(false); }}>Settings</DropdownItem>
                  <div className="my-2 border-t border-gray-100 dark:border-dark-border" />
                  <DropdownItem icon={<LogOut size={16} />} danger onClick={handleLogout}>Logout</DropdownItem>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar/Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-dark-bg border-b border-gray-200 dark:border-dark-border px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top w-full">
          <button onClick={() => scrollToSection("home")} className="text-left py-2 font-semibold">Home</button>
          <button onClick={() => scrollToSection("services")} className="text-left py-2 font-semibold">Services</button>
          <button onClick={() => scrollToSection("about")} className="text-left py-2 font-semibold">About</button>
          <button onClick={() => scrollToSection("contact")} className="text-left py-2 font-semibold">Contact</button>
          <div className="pt-4 border-t border-gray-100 dark:border-dark-border">
            <ThemeToggle />
          </div>
        </div>
      )}
    </nav>
  );
}

function DropdownItem({ children, icon, onClick, danger = false }: { children: React.ReactNode; icon: React.ReactNode; onClick: () => void; danger?: boolean; }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition ${danger ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10" : "hover:bg-gray-50 dark:hover:bg-white/5"}`}
    >
      {icon} {children}
    </button>
  );
}