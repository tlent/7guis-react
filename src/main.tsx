import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import "./index.css";

const root = document.querySelector("#root");
if (!root) {
  throw new Error("Document missing #root element");
}
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
