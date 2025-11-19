import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/failed-paypal.css";

export default function PaypalCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="paypal-cancel-page">
      <div className="cancel-card">
        <h1>❌ PayPal Transaction Failed</h1>
        <p>It seems that your payment was cancelled or an error occurred.</p>
        <p>
          No amount has been charged. You can retry or return to your cart to
          modify your order.
        </p>

        <div className="cancel-actions">
          <button className="btn-retry" onClick={() => navigate("/checkout")}>
            🔁 Retry Payment
          </button>
          <button className="btn-cart" onClick={() => navigate("/cart")}>
            🛒 Return to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
