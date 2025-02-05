import React from "react";
import ReactDOM from "react-dom/client";
import App from "../app";
import { AuthProvider } from "../contexts/auth.context";
import "./index.css"; // Tailwind styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
