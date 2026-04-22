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
      {/* ml-24 matches Sidebar w-24 | lg:ml-72 matches Sidebar w-72 */}
      <div className="flex-1 flex flex-col ml-24 lg:ml-72 transition-all duration-500 ease-in-out">

        {/* ================= TOP NAVBAR ================= */}
        <Navbar />

        {/* spacing for fixed navbar */}
        <div className="h-16" />

        {/* ================= PAGE CONTENT ================= */}
        <main className="flex-1 px-4 sm:px-6 py-6">

          {/* REMOVED max-w-7xl and mx-auto to let content fill available width */}
          <div className="w-full">

            {/* ================= PAGE WRAPPER ================= */}
            <div className="
              bg-light-card dark:bg-dark-surface
              border border-light-border dark:border-dark-border
              rounded-2xl
              p-6 sm:p-8
              shadow-sm
              min-h-[70vh]
              w-full
            ">
              <Outlet />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}