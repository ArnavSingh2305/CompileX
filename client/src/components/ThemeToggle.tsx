import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// Quick light/dark flip for pages that don't have Settings (landing, auth).
export const ThemeToggle = ({ className = "" }: { className?: string }) => {
  const { resolvedTheme, setMode } = useTheme();
  const toDark = resolvedTheme === "light";

  return (
    <button
      type="button"
      onClick={() => setMode(toDark ? "dark" : "light")}
      title={toDark ? "Switch to dark theme" : "Switch to light theme"}
      aria-label={toDark ? "Switch to dark theme" : "Switch to light theme"}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-fg/60 transition-colors hover:bg-fg/5 hover:text-fg ${className}`}
    >
      {toDark ? <Moon size={17} /> : <Sun size={17} />}
    </button>
  );
};
