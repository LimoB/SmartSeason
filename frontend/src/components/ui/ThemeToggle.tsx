import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { toggleTheme } from "@/features/theme/themeSlice";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.theme.mode);

  const isDark = mode === "dark";

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="
        w-full flex items-center justify-between
        px-3 py-2
        text-sm rounded-md
        transition
        hover:bg-gray-100 dark:hover:bg-dark-surface2
      "
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-2">
        {isDark ? <Sun size={15} /> : <Moon size={15} />}
        <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
      </div>

      {/* RIGHT SWITCH */}
      <div
        className={`
          relative w-9 h-5 rounded-full transition
          ${isDark ? "bg-primary-500" : "bg-gray-300"}
        `}
      >
        <div
          className={`
            absolute top-0.5 left-0.5
            w-4 h-4 bg-white rounded-full shadow-sm
            transition-transform duration-300
            ${isDark ? "translate-x-4" : ""}
          `}
        />
      </div>
    </button>
  );
}