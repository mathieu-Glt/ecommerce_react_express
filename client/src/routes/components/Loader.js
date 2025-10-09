// src/components/Loader.js
import React from "react";
import logo from "../../assets/logo.png";
import "./Loader.css";

export default function Loader() {
  return (
    <div className="loader-container">
      <img src={logo} alt="Logo" className="logo-loader" />
    </div>
  );
}
