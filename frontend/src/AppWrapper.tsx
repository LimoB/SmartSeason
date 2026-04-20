import { useEffect } from "react";
import { useAppSelector } from "./app/hooks";

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const mode = useAppSelector((state) => state.theme.mode);

  useEffect(() => {
    const root = document.documentElement;

    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [mode]);

  return <>{children}</>;
}