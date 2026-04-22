import { useState, useEffect, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Tractor,
  ClipboardList,
  Users,
  Menu,
  X,
  Sprout
} from "lucide-react";

import { useAppSelector } from "../app/hooks";

interface NavItemProps {
  to: string;
  icon: ReactNode;
  label: string;
  open: boolean;
  linkClass: (props: { isActive: boolean }) => string;
  onClick?: () => void;
}

export default function Sidebar() {
  const user = useAppSelector((state) => state.auth.user);

  // Initialize state based on current window width to avoid cascading effect
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [open, setOpen] = useState(window.innerWidth >= 1024);

  const role = user?.role;
  const isAdmin = role === "admin";

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // Logic to adjust sidebar state when screen size crosses the breakpoint
      if (mobile) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dashboardPath = isAdmin ? "/admin/dashboard" : "/agent/dashboard";
  const fieldsPath = "/fields";
  const updatesPath = "/updates";
  const usersPath = "/admin/users";

  const linkClass = ({ isActive }: { isActive: boolean }) => `
    group flex items-center gap-3 px-4 py-3 rounded-xl
    text-sm font-bold transition-all duration-200
    ${
      isActive
        ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
    }
  `;

  // Explicitly close sidebar on mobile navigation to avoid needing useEffect(location)
  const handleNavClick = () => {
    if (isMobile) {
      setOpen(false);
    }
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isMobile && open && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen z-[70]
          bg-white dark:bg-slate-900
          border-r border-slate-200 dark:border-slate-800
          transition-all duration-300 ease-in-out
          ${isMobile 
            ? (open ? "translate-x-0 w-72" : "-translate-x-full w-72") 
            : (open ? "w-64" : "w-20")
          }
        `}
      >
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between px-4 h-16 md:h-20 border-b border-slate-100 dark:border-slate-800">
          {(open || isMobile) && (
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-green-600 rounded-lg">
                <Sprout size={20} className="text-white" />
              </div>
              <div className="leading-tight">
                <h1 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                  SmartSeason
                </h1>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                  {role?.replace("_", " ")}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={() => setOpen(!open)}
            className={`p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors
              ${!open && !isMobile ? "mx-auto" : ""}`}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* ================= MENU ================= */}
        <nav className="mt-6 flex flex-col gap-2 px-3">
          <NavItem 
            to={dashboardPath} 
            icon={<LayoutDashboard size={22} />} 
            label="Dashboard" 
            open={open || isMobile} 
            linkClass={linkClass}
            onClick={handleNavClick}
          />
          <NavItem 
            to={fieldsPath} 
            icon={<Tractor size={22} />} 
            label="Fields" 
            open={open || isMobile} 
            linkClass={linkClass}
            onClick={handleNavClick}
          />
          <NavItem 
            to={updatesPath} 
            icon={<ClipboardList size={22} />} 
            label="Updates" 
            open={open || isMobile} 
            linkClass={linkClass}
            onClick={handleNavClick}
          />

          {isAdmin && (
            <NavItem 
              to={usersPath} 
              icon={<Users size={22} />} 
              label="Users" 
              open={open || isMobile} 
              linkClass={linkClass}
              onClick={handleNavClick}
            />
          )}
        </nav>

        {/* ================= FOOTER ================= */}
        {(open || isMobile) && (
          <div className="absolute bottom-6 left-6 right-6">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Version</p>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-300">v1.0.4-Stable</p>
            </div>
          </div>
        )}
      </aside>

      {/* MOBILE TRIGGER */}
      {isMobile && !open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 p-4 bg-green-600 text-white rounded-full shadow-2xl z-[55] active:scale-90 transition-transform"
        >
          <Menu size={24} />
        </button>
      )}
    </>
  );
}

function NavItem({ to, icon, label, open, linkClass, onClick }: NavItemProps) {
  return (
    <NavLink to={to} className={linkClass} onClick={onClick}>
      <div className="min-w-[22px]">{icon}</div>
      {open && <span className="truncate">{label}</span>}
    </NavLink>
  );
}