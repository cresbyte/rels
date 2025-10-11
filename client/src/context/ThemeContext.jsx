// src/theme/ThemeContext.js
import React, { createContext, useState, useEffect, useMemo } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { themes, getHighContrastTheme } from "./themes";
import { CssBaseline } from "@mui/material";
import "@fontsource/nunito/300.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/500.css";
import "@fontsource/nunito/600.css";
import "@fontsource/nunito/700.css";

// Create the context
export const ThemeContext = createContext({
  currentTheme: "light",
  setTheme: () => {},
  themeNames: Object.keys(themes),
  isHighContrast: false,
  toggleHighContrast: () => {},
});

// Function to detect system color scheme
const getSystemTheme = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
  }
  return "light"; // Default to light if media query not supported
};

// Create the provider component
export const ThemeProvider = ({ children }) => {
  // Get theme from localStorage or use 'light' as default
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem("appTheme");
    return savedTheme || "light";
  });

  // Get high contrast setting from localStorage
  const [isHighContrast, setIsHighContrast] = useState(() => {
    return localStorage.getItem("highContrast") === "true";
  });

  // Text spacing for readability
  const [textSpacing, setTextSpacing] = useState(() => {
    return localStorage.getItem("textSpacing") === "increased";
  });

  // Listen for system theme changes if using system theme
  useEffect(() => {
    if (currentTheme === "system") {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        // Force a re-render when system theme changes
        setCurrentTheme("system");
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [currentTheme]);

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem("appTheme", currentTheme);
    // Apply a subtle transition effect to the body
    document.body.style.transition = "background-color 0.3s ease";
  }, [currentTheme]);

  // Update localStorage when high contrast changes
  useEffect(() => {
    localStorage.setItem("highContrast", isHighContrast);
  }, [isHighContrast]);

  // Update localStorage when text spacing changes
  useEffect(() => {
    localStorage.setItem("textSpacing", textSpacing ? "increased" : "normal");
  }, [textSpacing]);

  // Set theme function
  const setTheme = (themeName) => {
    setCurrentTheme(themeName);
  };

  // Toggle high contrast mode
  const toggleHighContrast = () => {
    setIsHighContrast(prev => !prev);
  };

  // Toggle text spacing
  const toggleTextSpacing = () => {
    setTextSpacing(prev => !prev);
  };

  // Determine the actual theme to use
  const actualTheme = currentTheme === "system" ? getSystemTheme() : currentTheme;

  // Apply high contrast if enabled
  const finalTheme = isHighContrast 
    ? getHighContrastTheme(actualTheme) 
    : themes[actualTheme] || themes.light;

  // Apply text spacing
  if (textSpacing) {
    finalTheme.typography = {
      ...finalTheme.typography,
      body1: {
        ...finalTheme.typography.body1,
        letterSpacing: '0.02em',
        lineHeight: 1.8,
      },
      body2: {
        ...finalTheme.typography.body2,
        letterSpacing: '0.02em',
        lineHeight: 1.8,
      },
    };
  }

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      currentTheme,
      setTheme,
      themeNames: ["light", "dark", "system"],
      isHighContrast,
      toggleHighContrast,
      textSpacing,
      toggleTextSpacing,
    }),
    [currentTheme, isHighContrast, textSpacing]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <MuiThemeProvider theme={finalTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook for using the theme context
export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
