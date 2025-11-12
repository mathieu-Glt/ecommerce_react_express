// src/components/header/Header.tsx
import React from "react";
import "./admin-header.css";
import iphoneImage from "../../../assets/videos/Untitled.mp4"; // Assurez-vous d'avoir cette image dans le dossier assets
import { AdminNavigation } from "../Navigation/AdminNavigation";

export const AdminHeader: React.FC = () => {
  return (
    <header className="site-header-admin">
      {/* Bannière principale */}
      <div className="hero-banner-admin">
        {/* Effet de lumière en arrière-plan */}
        <div className="hero-glow"></div>

        {/* Contenu principal */}
        <div className="hero-container-admin">
          <div className="hero-grid">
            {/* Colonne gauche - Texte */}
            <div className="hero-content-admin">
              <div className="badge-promo-admin">🔥 Nouveautés 2025</div>

              <h1 className="hero-title-admin">
                Trouvez votre
                <span className="hero-title-gradient-admin">iPhone idéal</span>
              </h1>

              <p className="hero-subtitle-admin">
                Neufs et reconditionnés certifiés. Garantie 2 ans. Livraison
                gratuite.
              </p>

              {/* Features */}
              <div className="hero-features-admin">
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
                <div className="feature-admin">
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
                {/* <div className="feature-admin">
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
                </div> */}
              </div>
            </div>

            {/* Colonne droite - Image iPhone */}
            <div className="hero-image-section-admin">
              <div className="image-container-admin">
                {/* Effet glow derrière l'iPhone */}
                <div className="image-glow-effect"></div>

                {/* Image iPhone */}
                {/* <img src={iphoneImage} alt="iPhone" className="iphone-image" /> */}
                <video className="iphone-video" autoPlay loop muted playsInline>
                  <source src={iphoneImage} type="video/mp4" />
                  Votre navigateur ne supporte pas les vidéos.
                </video>

                {/* Badge promo */}
                {/* <div className="discount-badge">
                  Offers -10% -50% on reconditionned iPhones
                </div>
                <div className="discount-badge">
                  Offers -10% -50% on reconditionned iPhones
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Décorations */}
        <div className="hero-bottom-gradient-admin"></div>
      </div>

      {/* Navigation */}
      <div className="navigation-container-admin">
        <AdminNavigation />
      </div>
    </header>
  );
};
