// src/components/footer/Footer.tsx
import React from "react";
import "./Footer.css";

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      {/* Section réseaux sociaux */}
      <div className="footer-section social-section">
        <div className="container">
          <div className="social-wrapper">
            <span className="social-label">
              Suivez-nous sur les réseaux sociaux :
            </span>
            <div className="social-links">
              <a href="#" className="social-icon" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="social-icon" aria-label="Google">
                <i className="fab fa-google"></i>
              </a>
              <a href="#" className="social-icon" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="social-icon" aria-label="LinkedIn">
                <i className="fab fa-linkedin"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Section liens */}
      <div className="footer-section links-section">
        <div className="container">
          <div className="footer-columns">
            {/* Colonne 1 */}
            <div className="footer-col">
              <h3 className="col-title">À propos</h3>
              <ul className="col-list">
                <li>
                  <a href="#">Notre histoire</a>
                </li>
                <li>
                  <a href="#">Notre équipe</a>
                </li>
                <li>
                  <a href="#">Carrières</a>
                </li>
                <li>
                  <a href="#">Blog</a>
                </li>
              </ul>
            </div>

            {/* Colonne 2 */}
            <div className="footer-col">
              <h3 className="col-title">Produits</h3>
              <ul className="col-list">
                <li>
                  <a href="#">iPhone 16 Pro</a>
                </li>
                <li>
                  <a href="#">iPhone 15</a>
                </li>
                <li>
                  <a href="#">Reconditionnés</a>
                </li>
                <li>
                  <a href="#">Accessoires</a>
                </li>
              </ul>
            </div>

            {/* Colonne 3 */}
            <div className="footer-col">
              <h3 className="col-title">Support</h3>
              <ul className="col-list">
                <li>
                  <a href="#">Centre d'aide</a>
                </li>
                <li>
                  <a href="#">Garantie</a>
                </li>
                <li>
                  <a href="#">Retours</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
              </ul>
            </div>

            {/* Colonne 4 */}
            <div className="footer-col">
              <h3 className="col-title">Légal</h3>
              <ul className="col-list">
                <li>
                  <a href="#">Mentions légales</a>
                </li>
                <li>
                  <a href="#">CGV</a>
                </li>
                <li>
                  <a href="#">Confidentialité</a>
                </li>
                <li>
                  <a href="#">Cookies</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Section newsletter */}
      <div className="footer-section newsletter-section">
        <div className="container">
          <div className="newsletter-wrapper">
            <div className="newsletter-info">
              <h3 className="newsletter-heading">📧 Restez informé</h3>
              <p className="newsletter-desc">
                Inscrivez-vous pour nos offres exclusives
              </p>
            </div>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder="Votre email"
                className="newsletter-email"
              />
              <button type="submit" className="newsletter-btn">
                S'inscrire
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-section copyright-section">
        <div className="container">
          <div className="copyright-wrapper">
            <p className="copyright-text">
              © 2025 EShop - 365. Tous droits réservés.
            </p>
            <div className="payment-methods">
              <span className="payment-label">Paiement sécurisé</span>
              <i className="fab fa-cc-visa"></i>
              <i className="fab fa-cc-mastercard"></i>
              <i className="fab fa-cc-paypal"></i>
              <i className="fab fa-cc-apple-pay"></i>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
