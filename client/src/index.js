import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.js";
import "./styles/index.scss";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<StrictMode><App /></StrictMode>);
} else {
  console.error("Root element with ID 'root' not found.");
}
