import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ChatPage from "./pages/ChatPage";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat/:roomId" element={<ChatPage />} />
      </Routes>
    </div>
  );
};

export default App;
