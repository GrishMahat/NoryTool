"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";
type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // Initial theme setup
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    
    setTheme(savedTheme || systemPreference);
    setMounted(true);
  }, []);

  // Update DOM and localStorage when theme changes
  useEffect(() => {
    if (!mounted) return;
    
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const value = {
    theme,
    setTheme,
  };

  // Prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};