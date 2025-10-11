import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./context/ThemeContext";

// Import Plus Jakarta Sans font weights
import '@fontsource/plus-jakarta-sans/300.css'; // Light
import '@fontsource/plus-jakarta-sans/400.css'; // Regular
import '@fontsource/plus-jakarta-sans/500.css'; // Medium
import '@fontsource/plus-jakarta-sans/600.css'; // Semi-Bold
import '@fontsource/plus-jakarta-sans/700.css'; // Bold

import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <ThemeProvider>
        <App />
      </ThemeProvider>
  </StrictMode>
);
