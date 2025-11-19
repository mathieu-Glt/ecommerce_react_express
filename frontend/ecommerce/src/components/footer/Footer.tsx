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
            <span className="social-label">Follow us on social media :</span>
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
              <h3 className="col-title">About Us</h3>
              <ul className="col-list">
                <li>
                  <a href="#">Our Story</a>
                </li>
                <li>
                  <a href="#">Our Team</a>
                </li>
                <li>
                  <a href="#">Careers</a>
                </li>
                <li>
                  <a href="#">Blog</a>
                </li>
              </ul>
            </div>

            {/* Colonne 2 */}
            <div className="footer-col">
              <h3 className="col-title">Products</h3>
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
                  <a href="#">Help Center</a>
                </li>
                <li>
                  <a href="#">Warranty</a>
                </li>
                <li>
                  <a href="#">Returns</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
              </ul>
            </div>

            {/* Colonne 4 */}
            <div className="footer-col">
              <h3 className="col-title">Legal</h3>
              <ul className="col-list">
                <li>
                  <a href="#">Legal Notice</a>
                </li>
                <li>
                  <a href="#">CGV</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
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
              <h3 className="newsletter-heading">📧 Stay Informed</h3>
              <p className="newsletter-desc">
                Sign up for our exclusive offers and latest product news!
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
              © 2025 EShop - 365. All rights reserved.
            </p>
            <div className="payment-methods">
              <span className="payment-label">Secure Payment</span>
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
