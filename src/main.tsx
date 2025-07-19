import { createRoot } from "react-dom/client";
import Router from "./routes.tsx";
import { StrictMode } from "react";
import ReactQueryProvider from "./lib/providers/ReactQueryProvider";
import "./index.css";

const root = document.getElementById("root")!;
createRoot(root).render(
  <StrictMode>
    <ReactQueryProvider>
      <Router />
    </ReactQueryProvider>
  </StrictMode>
);
