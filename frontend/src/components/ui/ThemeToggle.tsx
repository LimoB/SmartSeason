import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { toggleTheme } from "@/features/theme/themeSlice";

// Lucide icons
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.theme.mode);

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="flex items-center gap-2 px-4 py-2 rounded
                 bg-gray-200 dark:bg-darkBlue-800
                 text-black dark:text-white
                 transition hover:scale-105"
    >
      {mode === "light" ? (
        <>
          <Moon size={18} />
          <span>Dark</span>
        </>
      ) : (
        <>
          <Sun size={18} />
          <span>Light</span>
        </>
      )}
    </button>
  );
}