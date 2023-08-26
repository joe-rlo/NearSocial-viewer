import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js')
	.then((registration) => {
	  console.log('Service Worker registered with scope:', registration.scope);
	})
	.catch((error) => {
	  console.log('Service Worker registration failed:', error);
	});
}