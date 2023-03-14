import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import "./index.css";

const root = document.querySelector("#root");
if (!root) {
  throw new Error("Document missing #root element");
}
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
