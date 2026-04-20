import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  return (
    <div className="
      min-h-screen
      bg-light-bg dark:bg-dark-bg
      text-light-text dark:text-dark-text
      transition-colors duration-300
      flex
    ">

      {/* ================= SIDEBAR ================= */}
      <Sidebar />

      {/* ================= MAIN CONTENT AREA ================= */}
      <div className="flex-1 flex flex-col ml-20 md:ml-64 transition-all duration-300">

        {/* ================= TOP NAVBAR ================= */}
        <Navbar />

        {/* spacing for fixed navbar */}
        <div className="h-16" />

        {/* ================= PAGE CONTENT ================= */}
        <main className="flex-1 px-4 sm:px-6 py-6">

          <div className="max-w-7xl mx-auto">

            {/* ================= PAGE WRAPPER ================= */}
            <div className="
              bg-light-card dark:bg-dark-surface
              border border-light-border dark:border-dark-border
              rounded-2xl
              p-6 sm:p-8
              shadow-sm
              min-h-[70vh]
            ">

              <Outlet />

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}