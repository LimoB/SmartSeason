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
  Sprout,
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
    setMobileMenuOpen(false); 

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
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
    setOpen(false);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-white/90 dark:bg-dark-bg/90 backdrop-blur-xl border-b border-gray-200/60 dark:border-dark-border text-gray-800 dark:text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between">
        
        {/* LEFT: Logo & Nav Links */}
        <div className="flex items-center gap-4 md:gap-10">
          <button 
            onClick={() => scrollToSection("home")}
            className="flex items-center gap-2 text-lg md:text-xl font-bold text-green-600 tracking-tight"
          >
            <Sprout className="w-6 h-6" />
            <span className="hidden xs:block">SmartSeason</span>
          </button>

          <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-gray-500 dark:text-gray-400">
            {["home", "services", "about", "contact"].map((id) => (
              <button 
                key={id}
                onClick={() => scrollToSection(id)} 
                className="hover:text-green-600 transition-colors capitalize"
              >
                {id}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>

          {!user ? (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-green-600 transition px-2">
                Login
              </Link>
              <Link to="/register" className="hidden xs:flex px-5 py-2.5 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition shadow-lg shadow-green-600/20">
                Get Started
              </Link>
            </div>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 p-1 md:pr-3 rounded-full bg-gray-100 dark:bg-slate-800 hover:ring-2 hover:ring-green-500/30 transition"
              >
                <div className="w-8 h-8 md:w-9 md:h-9 bg-green-600 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-bold shadow-inner">
                  {initials}
                </div>
                <span className="text-sm font-bold hidden md:block">
                  {user.fullName.split(" ")[0]}
                </span>
              </button>

              {/* Profile Dropdown */}
              {open && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-3 md:hidden border-b border-gray-50 dark:border-slate-800">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Account</p>
                    <p className="text-sm font-bold truncate">{user.fullName}</p>
                  </div>
                  <DropdownItem icon={<User size={18} />} onClick={() => { navigate("/profile"); setOpen(false); }}>Profile</DropdownItem>
                  <DropdownItem icon={<LayoutDashboard size={18} />} onClick={() => { navigate(getDashboardRoute()); setOpen(false); }}>Dashboard</DropdownItem>
                  <DropdownItem icon={<Settings size={18} />} onClick={() => { navigate("/settings"); setOpen(false); }}>Settings</DropdownItem>
                  <div className="my-1 border-t border-gray-100 dark:border-slate-800" />
                  <DropdownItem icon={<LogOut size={18} />} danger onClick={handleLogout}>Logout</DropdownItem>
                </div>
              )}
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 top-16 md:top-20 z-40 lg:hidden transition-all duration-300 ${mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
        
        {/* Menu Content */}
        <div className={`absolute right-0 top-0 h-full w-[280px] bg-white dark:bg-dark-bg shadow-xl border-l border-gray-100 dark:border-slate-800 p-6 flex flex-col gap-2 transition-transform duration-300 ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Navigation</p>
          <MobileNavItem onClick={() => scrollToSection("home")} icon={<Home size={20}/>}>Home</MobileNavItem>
          <MobileNavItem onClick={() => scrollToSection("services")}>Services</MobileNavItem>
          <MobileNavItem onClick={() => scrollToSection("about")}>About</MobileNavItem>
          <MobileNavItem onClick={() => scrollToSection("contact")}>Contact</MobileNavItem>
          
          <div className="mt-auto pt-6 border-t border-gray-100 dark:border-slate-800 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-medium">Dark Mode</span>
              <ThemeToggle />
            </div>
            {!user && (
              <Link 
                to="/register" 
                onClick={() => setMobileMenuOpen(false)}
                className="w-full py-4 rounded-xl bg-green-600 text-white font-bold text-center shadow-lg"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function DropdownItem({ children, icon, onClick, danger = false }: { children: React.ReactNode; icon: React.ReactNode; onClick: () => void; danger?: boolean; }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors ${danger ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10" : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800"}`}
    >
      <span className="opacity-70">{icon}</span>
      {children}
    </button>
  );
}

function MobileNavItem({ children, onClick, icon }: { children: React.ReactNode; onClick: () => void; icon?: React.ReactNode }) {
  return (
    <button 
      onClick={onClick} 
      className="flex items-center gap-3 w-full text-left py-4 px-4 rounded-xl font-bold text-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all active:scale-[0.98]"
    >
      {icon && <span className="text-green-600">{icon}</span>}
      {children}
    </button>
  );
}