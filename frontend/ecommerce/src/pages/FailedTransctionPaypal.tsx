import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/failed-paypal.css";

export default function PaypalCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="paypal-cancel-page">
      <div className="cancel-card">
        <h1>❌ Échec de la transaction PayPal</h1>
        <p>
          Il semble que votre paiement ait été annulé ou qu’une erreur se soit
          produite.
        </p>
        <p>
          Aucun montant n’a été débité. Vous pouvez réessayer ou retourner à
          votre panier pour modifier votre commande.
        </p>

        <div className="cancel-actions">
          <button className="btn-retry" onClick={() => navigate("/checkout")}>
            🔁 Réessayer le paiement
          </button>
          <button className="btn-cart" onClick={() => navigate("/cart")}>
            🛒 Retourner au panier
          </button>
        </div>
      </div>
    </div>
  );
}
