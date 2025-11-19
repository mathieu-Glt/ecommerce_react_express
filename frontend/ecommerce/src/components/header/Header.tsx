import React from "react";
import { Navigation } from "../navigation/NavBar";
import "./Header.css";
import iphoneImage from "../../assets/videos/Untitled.mp4";

export const Header: React.FC = () => {
  return (
    <header className="site-header">
      {/* Main banner */}
      <div className="hero-banner">
        {/* Background light effect */}
        <div className="hero-glow"></div>

        {/* Main content */}
        <div className="hero-container">
          <div className="hero-grid">
            {/* Left column - Text */}
            <div className="hero-content">
              <div className="badge-promo">🔥 Nouveautés 2025</div>

              <h1 className="hero-title">
                Trouvez votre
                <span className="hero-title-gradient">iPhone idéal</span>
              </h1>

              <p className="hero-subtitle">
                Neufs et reconditionnés certifiés. Garantie 2 ans. Livraison
                gratuite.
              </p>

              <div className="hero-buttons">
                <button className="btn-primary-hero">
                  Découvrir la collection
                </button>
                <button className="btn-secondary-hero">
                  Comparer les modèles
                </button>
              </div>

              {/* Features */}
              <div className="hero-features">
                <div className="feature">
                  <svg
                    className="feature-icon"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Livraison 24h</span>
                </div>
                <div className="feature">
                  <svg
                    className="feature-icon"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Garantie 2 ans</span>
                </div>
                <div className="feature">
                  <svg
                    className="feature-icon"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Paiement sécurisé</span>
                </div>
              </div>
            </div>

            {/* Right column - iPhone image */}
            <div className="hero-image-section">
              <div className="image-container">
                {/* Glow effect behind the iPhone */}
                <div className="image-glow-effect"></div>

                {/* iPhone image */}
                {/* <img src={iphoneImage} alt="iPhone" className="iphone-image" /> */}
                <video className="iphone-video" autoPlay loop muted playsInline>
                  <source src={iphoneImage} type="video/mp4" />
                  Votre navigateur ne supporte pas les vidéos.
                </video>

                {/* Promo badge */}
                <div className="discount-badge">
                  Offers -10% -50% on reconditionned iPhones
                </div>
                <div className="discount-badge">
                  Offers -10% -50% on reconditionned iPhones
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* DDecorations */}
        <div className="hero-bottom-gradient"></div>
      </div>

      {/* Navigation */}
      <div className="navigation-container">
        <Navigation />
      </div>
    </header>
  );
};
