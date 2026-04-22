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
  isExpanded: boolean;
  linkClass: (props: { isActive: boolean }) => string;
  onClick?: () => void;
}

export default function Sidebar() {
  const user = useAppSelector((state) => state.auth.user);

  // isMobile tracks screen size
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  // isExpanded tracks if the sidebar is "open" (showing labels) or "collapsed" (icons only)
  const [isExpanded, setIsExpanded] = useState(window.innerWidth >= 1024);

  const role = user?.role;
  const isAdmin = role === "admin";

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // On Desktop, keep it expanded. On Mobile, default to collapsed (Rail).
      setIsExpanded(!mobile);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dashboardPath = isAdmin ? "/admin/dashboard" : "/agent/dashboard";
  const fieldsPath = "/fields";
  const updatesPath = "/updates";
  const usersPath = "/admin/users";

  // Navigation Click: If on mobile, collapse the sidebar after clicking a link
  const handleNavClick = () => {
    if (isMobile) {
      setIsExpanded(false);
    }
  };

  const linkClass = ({ isActive }: { isActive: boolean }) => `
    group flex items-center transition-all duration-300 ease-in-out rounded-xl mb-1
    ${isExpanded ? "px-4 py-3 gap-3" : "p-3 justify-center"}
    ${
      isActive
        ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
    }
  `;

  return (
    <>
      {/* MOBILE OVERLAY: Only shows when sidebar is expanded on mobile */}
      {isMobile && isExpanded && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60] transition-opacity duration-300"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen z-[70]
          bg-white dark:bg-slate-900 
          border-r border-slate-200 dark:border-slate-800
          transition-all duration-300 ease-in-out
          ${isExpanded ? "w-64" : "w-20"}
        `}
      >
        {/* ================= HEADER / TOGGLE ================= */}
        <div className={`flex items-center h-16 md:h-20 border-b border-slate-100 dark:border-slate-800 px-4
          ${isExpanded ? "justify-between" : "justify-center"}`}
        >
          {isExpanded && (
            <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-300">
              <div className="p-1.5 bg-green-600 rounded-lg shrink-0">
                <Sprout size={18} className="text-white" />
              </div>
              <div className="leading-tight">
                <h1 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                  SmartSeason
                </h1>
                <p className="text-[9px] uppercase tracking-tighter text-slate-400 font-bold">
                  {role?.replace("_", " ")}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-500"
          >
            {isExpanded ? <X size={20} /> : <Menu size={22} />}
          </button>
        </div>

        {/* ================= MENU ITEMS ================= */}
        <nav className="mt-6 flex flex-col px-3">
          <NavItem 
            to={dashboardPath} 
            icon={<LayoutDashboard size={22} />} 
            label="Dashboard" 
            isExpanded={isExpanded} 
            linkClass={linkClass}
            onClick={handleNavClick}
          />
          <NavItem 
            to={fieldsPath} 
            icon={<Tractor size={22} />} 
            label="Fields" 
            isExpanded={isExpanded} 
            linkClass={linkClass}
            onClick={handleNavClick}
          />
          <NavItem 
            to={updatesPath} 
            icon={<ClipboardList size={22} />} 
            label="Updates" 
            isExpanded={isExpanded} 
            linkClass={linkClass}
            onClick={handleNavClick}
          />

          {isAdmin && (
            <NavItem 
              to={usersPath} 
              icon={<Users size={22} />} 
              label="Users" 
              isExpanded={isExpanded} 
              linkClass={linkClass}
              onClick={handleNavClick}
            />
          )}
        </nav>

        {/* ================= FOOTER / VERSION ================= */}
        <div className="absolute bottom-6 left-0 w-full px-3">
          <div className={`
            flex items-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all duration-300
            ${isExpanded ? "p-4 gap-3" : "p-3 justify-center"}
          `}>
             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />
             {isExpanded && (
               <div className="animate-in slide-in-from-left-2 duration-300">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                 <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300">v1.0.4 Online</p>
               </div>
             )}
          </div>
        </div>
      </aside>

      {/* Main Content Spacer (adjusts based on sidebar width) */}
      <div className={`transition-all duration-300 ${isExpanded ? "pl-64" : "pl-20"}`} />
    </>
  );
}

function NavItem({ to, icon, label, isExpanded, linkClass, onClick }: NavItemProps) {
  return (
    <NavLink to={to} className={linkClass} onClick={onClick}>
      <div className="shrink-0">{icon}</div>
      {isExpanded && (
        <span className="truncate font-bold text-sm animate-in slide-in-from-left-3 duration-300">
          {label}
        </span>
      )}
      
      {/* Tooltip for collapsed state (Desktop only) */}
      {!isExpanded && (
        <div className="fixed left-20 ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity hidden lg:block whitespace-nowrap z-[100]">
          {label}
        </div>
      )}
    </NavLink>
  );
}