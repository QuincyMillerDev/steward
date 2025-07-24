// React application entry point for Steward AI assistant
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import StateProvider from "./components/providers/StateProvider";
import AlertSystem from "./components/alerts/AlertSystem";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StateProvider>
      <App />
      <AlertSystem position="top-right" />
    </StateProvider>
  </React.StrictMode>,
);
