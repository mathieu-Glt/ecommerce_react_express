// src/components/navigation/NavBar.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../routes";
import "./navigation-admin.css";
import { useAuth } from "../../../hooks/useAuth";
import LogoutButton from "../../Logout/LogoutButton";
import { useFilter } from "../../../context/FilterSearchBarContext";
import logo from "../../../assets/logo.png";

export const AdminNavigation: React.FC = () => {
  // const {user, isAuthenticated} = useUserContext();
  const { toggleBarFilter } = useFilter();
  const { user, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <nav className="navbar-admin">
      <div className="navbar-container-admin">
        {/* Logo */}
        <img src={logo} alt="Logo" className="logo-loader_nav " />

        {/* Menu burger (mobile) */}
        <button
          className={`navbar-toggle ${isMenuOpen ? "active" : ""}`}
          onClick={toggleMenu}
          aria-label="Toggle navigation"
        >
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
          <span className="toggle-line"></span>
        </button>

        {/* Menu de navigation */}
        <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <div className="nav-links">
            {/* <button onClick={toggleBarFilter}>Recherche avancées</button> */}
            <Link to={ROUTES.PRODUCTS} className="nav-link" onClick={closeMenu}>
              Dashboard
            </Link>
            <Link
              to={ROUTES.ADMIN.CREATE_PRODUCTS}
              className="nav-link"
              onClick={closeMenu}
            >
              Create Product
            </Link>
            <Link
              to={ROUTES.ADMIN.LIST_PRODUCTS}
              className="nav-link"
              onClick={closeMenu}
            >
              Listing Product
            </Link>
            {/* <Link
              to={ROUTES.REGISTER}
              className="dropdown-item"
              onClick={closeMenu}
            >
              Sign up
            </Link> */}
            {isAuthenticated && user ? <LogoutButton /> : null}

            {/* Dropdown */}
            {/* <div className="nav-dropdown">
              <button className="nav-dropdown-toggle" onClick={toggleDropdown}>
                Dropdown
                <svg
                  className={`dropdown-arrow ${isDropdownOpen ? "rotate" : ""}`}
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="currentColor"
                >
                  <path d="M6 9L1 4h10z" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link
                    to="#action/3.3"
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    Something
                  </Link>
                  <div className="dropdown-divider"></div>
                  <Link
                    to="#action/3.4"
                    className="dropdown-item"
                    onClick={closeMenu}
                  >
                    Separated link
                  </Link>
                </div>
              )}
            </div> */}
          </div>
        </div>
      </div>
    </nav>
  );
};
