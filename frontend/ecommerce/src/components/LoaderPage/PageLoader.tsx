import React from "react";
import logo from "../../assets/logo.png";
import "./Loader.css";

const PageLoader = () => {
  return (
    <div className="d-flex justify-content-center align-items-center loader-container">
      <img src={logo} alt="Logo" className="logo-loader" />
    </div>
  );
};

export default PageLoader;
