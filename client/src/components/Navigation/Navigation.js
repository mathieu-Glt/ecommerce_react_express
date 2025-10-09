import React from "react";
import { Link, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import {
  AppstoreOutlined,
  UserAddOutlined,
  UserOutlined,
  LogoutOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
} from "@ant-design/icons";

function Navigation({
  paths,
  authenticatedUser,
  user,
  handleClick,
  currentUrl,
}) {
  const location = useLocation();

  // Couleur selon rôle
  const navStyle = {
    backgroundColor: user?.role === "admin" ? "black" : "blue",
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={navStyle}>
      <div className="container">
        {/* Logo/Brand */}
        <Link className="navbar-brand" to="/">
          <AppstoreOutlined /> E-Commerce
        </Link>

        {/* Bouton toggle pour mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Menu de navigation */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link
                className={`nav-link ${
                  location.pathname === "/" ? "active" : ""
                }`}
                to="/"
              >
                <AppstoreOutlined /> Home
              </Link>
            </li>
          </ul>

          {/* Éléments de droite */}
          <ul className="navbar-nav">
            {paths.map((item) => {
              if (item.key === "spacer" || item.disabled) return null;

              const isAuthLink =
                item.key === "register" || item.key === "login";
              const linkStyle = isAuthLink ? { fontWeight: "600" } : {};
              const linkClass = `nav-link ${
                isAuthLink ? "text-dark" : "text-white"
              }`;

              return (
                <li key={item.key} className="nav-item">
                  <div className={linkClass} style={linkStyle}>
                    {item.label}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}

Navigation.propTypes = {
  paths: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  authenticatedUser: PropTypes.bool,
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
  }),
  handleClick: PropTypes.func,
  currentUrl: PropTypes.string,
};

export default Navigation;
