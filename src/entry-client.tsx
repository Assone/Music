import "@/assets/main.css";
import { StartClient } from "@tanstack/react-router-server/client";
import React from "react";
import ReactDOM from "react-dom/client";
import { createRouter } from "./router";

const router = createRouter();
router.hydrate();

ReactDOM.hydrateRoot(
  document.getElementById("root")!,
  <React.StrictMode>
    <StartClient router={router} />
  </React.StrictMode>,
);
