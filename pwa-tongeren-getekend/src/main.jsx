import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container);

function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black z-50">
      <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

function Main() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data.type === "PRELOADING_START") {
          setIsLoading(true);
        } else if (event.data.type === "PRELOADING_END") {
          setTimeout(() => setIsLoading(false), 13000); // Ensure the loading screen lasts 13 seconds
        }
      });
    }
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <App />
    </>
  );
}

root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);