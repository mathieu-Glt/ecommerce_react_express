// src/components/navigation/NavBar.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../routes";
import logo from "../../assets/logo.png";
import "./NavBar.css";
import { useUserContext } from "../../context/userContext";
import { useAuth } from "../../hooks/useAuth";
import LogoutButton from "../Logout/LogoutButton";
import { useFilter } from "../../context/FilterSearchBarContext";
import CartCount from "../CartCount/CartCount";

export const Navigation: React.FC = () => {
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
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        {user && user?.role === "admin" ? (
          <Link to={ROUTES.ADMIN.DASHBOARD} className="navbar-logo">
            <img src={logo} alt="Logo" className="logo-loader_nav " />
          </Link>
        ) : (
          <img src={logo} alt="Logo" className="logo-loader_nav " />
        )}

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

        {/* Navigation menu */}
        <div className={`navbar-menu ${isMenuOpen ? "active" : ""}`}>
          <div className="nav-links">
            <button onClick={toggleBarFilter}>Advanced Search</button>
            <Link to={ROUTES.HOME} className="nav-link" onClick={closeMenu}>
              Home
            </Link>
            <Link to={ROUTES.PRODUCTS} className="nav-link" onClick={closeMenu}>
              Products
            </Link>
            <div className="container-count">
              <Link to={ROUTES.CART} className="nav-link" onClick={closeMenu}>
                Cart
              </Link>
              <CartCount />
            </div>
            <Link to={ROUTES.PROFILE} className="nav-link" onClick={closeMenu}>
              Profile
            </Link>
            <Link
              to={ROUTES.LOGIN}
              className="dropdown-item"
              onClick={closeMenu}
            >
              Sign in
            </Link>
            <Link
              to={ROUTES.REGISTER}
              className="dropdown-item"
              onClick={closeMenu}
            >
              Sign up
            </Link>
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
