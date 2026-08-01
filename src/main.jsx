import "./style.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import m3Theme from "./theme/m3Theme.js";
import App from "./App.jsx";
import { ThemeContextProvider } from "./theme/ThemeContext.jsx";

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <BrowserRouter>
        <ThemeContextProvider>
          <ThemeProvider theme={m3Theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </ThemeContextProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}
