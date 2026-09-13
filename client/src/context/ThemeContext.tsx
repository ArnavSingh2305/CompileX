import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  mode: ThemeMode;
  resolvedTheme: "light" | "dark";
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getSystemPreference = (): "light" | "dark" =>
  window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

const getStoredMode = (): ThemeMode => {
  const stored = localStorage.getItem("theme-mode");

  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }

  return "system";
};

export const ThemeProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [mode, setModeState] = useState<ThemeMode>(getStoredMode);

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() =>
    mode === "system" ? getSystemPreference() : mode
  );

  useEffect(() => {
    const applyResolved = () => {
      const resolved =
        mode === "system" ? getSystemPreference() : mode;

      setResolvedTheme(resolved);

      document.documentElement.classList.toggle(
        "dark",
        resolved === "dark"
      );
    };

    applyResolved();

    if (mode === "system") {
      const mediaQuery = window.matchMedia(
        "(prefers-color-scheme: dark)"
      );

      mediaQuery.addEventListener("change", applyResolved);

      return () => {
        mediaQuery.removeEventListener("change", applyResolved);
      };
    }
  }, [mode]);

  const setMode = (newMode: ThemeMode) => {
    localStorage.setItem("theme-mode", newMode);
    setModeState(newMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        resolvedTheme,
        setMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);

  if (!ctx) {
    throw new Error(
      "useTheme must be used within ThemeProvider"
    );
  }

  return ctx;
};