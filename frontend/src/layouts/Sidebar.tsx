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

  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [isExpanded, setIsExpanded] = useState(window.innerWidth >= 1024);

  const role = user?.role;
  const isAdmin = role === "admin";

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsExpanded(true);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dashboardPath = isAdmin ? "/admin/dashboard" : "/agent/dashboard";
  const fieldsPath = "/fields";
  const updatesPath = "/updates";
  const usersPath = "/admin/users";

  const handleNavClick = () => {
    if (isMobile) setIsExpanded(false);
  };

  const linkClass = ({ isActive }: { isActive: boolean }) => `
    group flex items-center transition-all duration-300 ease-in-out rounded-2xl mb-2
    ${isExpanded ? "px-4 py-3.5 gap-4" : "p-4 justify-center"}
    ${
      isActive
        ? "bg-green-600 text-white shadow-lg shadow-green-600/30 ring-1 ring-white/10"
        : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-green-600"
    }
  `;

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isMobile && isExpanded && (
        <div 
          className="fixed inset-0 bg-[#0b0e14]/60 backdrop-blur-sm z-[60] transition-opacity duration-300"
          onClick={() => setIsExpanded(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen z-[70]
          bg-white dark:bg-[#0b0e14] 
          border-r border-slate-200 dark:border-white/5
          transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
          ${isExpanded ? "w-72" : "w-24"}
        `}
      >
        {/* HEADER / LOGO */}
        <div className={`flex items-center h-20 md:h-24 px-6 border-b border-slate-100 dark:border-white/5
          ${isExpanded ? "justify-between" : "justify-center"}`}
        >
          {isExpanded && (
            <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="p-2 bg-green-600 rounded-xl shadow-lg shadow-green-600/20">
                <Sprout size={22} className="text-white" />
              </div>
              <div className="leading-none">
                <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">
                  SmartSeason
                </h1>
                <p className="text-[10px] uppercase tracking-[0.2em] text-green-600 font-black mt-1">
                  {role?.replace("_", " ")}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-500 hover:text-green-600 transition-colors border border-transparent dark:border-white/5"
          >
            {isExpanded ? <X size={20} /> : <Menu size={22} />}
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="mt-8 flex flex-col px-4">
          <NavItem 
            to={dashboardPath} 
            icon={<LayoutDashboard size={24} />} 
            label="Dashboard" 
            isExpanded={isExpanded} 
            linkClass={linkClass}
            onClick={handleNavClick}
          />
          <NavItem 
            to={fieldsPath} 
            icon={<Tractor size={24} />} 
            label="Sectors" 
            isExpanded={isExpanded} 
            linkClass={linkClass}
            onClick={handleNavClick}
          />
          <NavItem 
            to={updatesPath} 
            icon={<ClipboardList size={24} />} 
            label="Activity" 
            isExpanded={isExpanded} 
            linkClass={linkClass}
            onClick={handleNavClick}
          />

          {isAdmin && (
            <NavItem 
              to={usersPath} 
              icon={<Users size={24} />} 
              label="Personnel" 
              isExpanded={isExpanded} 
              linkClass={linkClass}
              onClick={handleNavClick}
            />
          )}
        </nav>

        {/* FOOTER STATUS */}
        <div className="absolute bottom-8 left-0 w-full px-4">
          <div className={`
            flex items-center bg-slate-50 dark:bg-[#16112b] rounded-2xl border border-slate-100 dark:border-white/5 transition-all duration-500
            ${isExpanded ? "p-4 gap-4" : "p-4 justify-center"}
          `}>
             <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping opacity-50" />
             </div>
             {isExpanded && (
               <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Node</p>
                 <p className="text-[12px] font-black text-slate-700 dark:text-slate-200">v1.0.4 ONLINE</p>
               </div>
             )}
          </div>
        </div>
      </aside>
    </>
  );
}

function NavItem({ to, icon, label, isExpanded, linkClass, onClick }: NavItemProps) {
  return (
    <NavLink to={to} className={linkClass} onClick={onClick}>
      <div className="shrink-0 transition-transform duration-300 group-hover:scale-110 group-active:scale-90">
        {icon}
      </div>
      {isExpanded && (
        <span className="truncate font-black text-[13px] uppercase tracking-wider animate-in fade-in slide-in-from-left-4 duration-500">
          {label}
        </span>
      )}
      
      {!isExpanded && (
        <div className="fixed left-24 ml-2 px-3 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 hidden lg:block whitespace-nowrap z-[100] border border-white/10 shadow-2xl">
          {label}
        </div>
      )}
    </NavLink>
  );
}