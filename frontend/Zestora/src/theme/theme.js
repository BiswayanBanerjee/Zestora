
// theme.js (updated)
/* assumes your existing useAppTheme returns { theme, setThemePreference } */
import { createTheme, useMediaQuery } from "@mui/material";
import { useMemo, useState, useEffect } from "react";

const applyThemeCssVars = (theme) => {
  if (typeof window === "undefined" || !theme?.palette) return;

  const palette = theme.palette;
  const vars = {
    "--mui-palette-background-default": palette.background?.default ?? "#f1f3f4",
    "--mui-palette-background-paper": palette.background?.paper ?? "#ffffff",
    "--mui-palette-text-primary": palette.text?.primary ?? "#111827",
    "--mui-palette-text-secondary": palette.text?.secondary ?? "#6b7280",
    "--mui-palette-divider": palette.divider ?? "rgba(0,0,0,0.08)",
    "--mui-palette-action-hover": (palette.action && palette.action.hover) ?? "rgba(0,0,0,0.04)",
    "--mui-palette-card-bg": palette.background?.paper ?? "#ffffff",
    "--mui-palette-input-bg": palette.mode === "dark" ? "rgba(255,255,255,0.04)" : (palette.background?.paper ?? "#ffffff"),
    "--swiggy-banner": palette.primary?.main ?? "#2f6f7f",
  };

  const root = document.documentElement;
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v));
};

const useAppTheme = () => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [userPreference, setUserPreference] = useState(
    localStorage.getItem("themePreference") || "system"
  );

  useEffect(() => {
    localStorage.setItem("themePreference", userPreference);
  }, [userPreference]);

  const mode =
    userPreference === "system" ? (prefersDarkMode ? "dark" : "light") : userPreference;

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: {
            default: mode === "dark" ? "#121212" : "#f5f5f5",
            paper: mode === "dark" ? "#1d1d1d" : "#ffffff",
          },
          text: {
            primary: mode === "dark" ? "#ffffff" : "#000000",
            secondary: mode === "dark" ? "#b0b0b0" : "#5f6368",
          },
          primary: {
            main: mode === "dark" ? "#2f6f7f" : "#2f6f7f", // choose as you like
          },
          divider: mode === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
        },
        typography: {
          fontFamily: ['"Roboto"', '"Helvetica Neue"', "Arial", "sans-serif"].join(","),
        },
      }),
    [mode]
  );

  // <-- set CSS variables on the root whenever the theme object changes
  useEffect(() => {
    applyThemeCssVars(theme);
  }, [theme]);

  const setThemePreference = (preference) => {
    setUserPreference(preference);
  };

  return { theme, setThemePreference };
};

export default useAppTheme;
