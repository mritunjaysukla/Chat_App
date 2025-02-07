import React from "react";
import { Link } from "react-router-dom";
import "./App.css";

const Home = () => {
  return (
    <div className="home">
      <h1>Welcome to the Chat App</h1>
      <div className="buttons">
        <Link to="/login" className="btn">
          Login
        </Link>
        <Link to="/register" className="btn">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Home;
