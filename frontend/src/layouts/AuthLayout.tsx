import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
    // "items-center justify-center" is GOOD for Login, but BAD for Dashboards.
    <div className="
      min-h-screen flex items-center justify-center 
      bg-light-bg dark:bg-dark-bg 
      text-light-text dark:text-dark-text 
      px-4 transition-colors duration-300
    ">

      <div className="
        w-full max-w-md 
        bg-white dark:bg-dark-surface 
        border border-light-border dark:border-dark-border 
        rounded-2xl p-8 shadow-xl
        transition-all duration-300
      ">

        {/* ================= LOGO ================= */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="text-green-600 dark:text-green-500 text-3xl font-black tracking-tighter"
          >
            SmartSeason
          </Link>

          <p className="text-slate-500 dark:text-slate-400 text-xs uppercase tracking-[0.2em] font-bold mt-2">
            Field Monitoring System
          </p>
        </div>

        {/* ================= PAGE CONTENT ================= */}
        {/* This renders your Login / Register forms */}
        <div className="w-full">
          <Outlet />
        </div>

      </div>
    </div>
  );
}