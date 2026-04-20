import { Outlet, Link } from "react-router-dom";

export default function AuthLayout() {
  return (
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
        rounded-2xl p-6 shadow-lg
        transition
      ">

        {/* ================= LOGO ================= */}
        <div className="text-center mb-6">

          <Link
            to="/"
            className="text-primary-500 text-2xl font-bold tracking-wide"
          >
            SmartSeason
          </Link>

          <p className="text-light-muted dark:text-dark-muted text-sm mt-1">
            Field Monitoring System
          </p>

        </div>

        {/* ================= PAGE CONTENT ================= */}
        <Outlet />

      </div>
    </div>
  );
}