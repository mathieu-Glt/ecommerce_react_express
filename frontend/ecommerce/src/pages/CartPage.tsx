import React, { useMemo } from "react";
import { useCart } from "../hooks/useCart";
import { useLocalStorage } from "../hooks/useLocalStorage";
import "./styles/cartpage.css"; // Pour le CSS externe

export const CartPage = () => {
  const { cart, loading, error, updateCartItem, removeFromCart, clearCart } =
    useCart();
  const { user } = useLocalStorage();

  // 🧮 Calcul du total et du nombre d'articles
  const { totalPrice, totalItems } = useMemo(() => {
    const total = cart?.reduce(
      (acc: any, item: any) => {
        const itemTotal = item.product.price * item.quantity;
        return {
          totalPrice: acc.totalPrice + itemTotal,
          totalItems: acc.totalItems + item.quantity,
        };
      },
      { totalPrice: 0, totalItems: 0 }
    );
    return total;
  }, [cart]);

  if (loading) return <p>Chargement du panier...</p>;
  if (error) return <p>Erreur : {error}</p>;
  if (!cart || cart.length === 0) return <p>Votre panier est vide</p>;

  return (
    <div className="cart-page">
      <h1>🛒 Mon panier</h1>

      <div className="cart-grid">
        {cart.map((item: any, index: number) => (
          <div className="cart-card" key={index}>
            <img
              src={
                item.product.images?.[0] || "https://via.placeholder.com/150"
              }
              alt={item.product.title}
              className="cart-card-img"
            />
            <div className="cart-card-content">
              <h2>{item.product.title}</h2>
              <p>Prix unitaire : {item.product.price} €</p>
              <p>Quantité : {item.quantity}</p>
              <p>Total : {(item.product.price * item.quantity).toFixed(2)} €</p>
            </div>

            <div className="cart-card-actions">
              <button
                className="btn-update"
                onClick={() =>
                  updateCartItem(item.product._id, item.quantity + 1)
                }
              >
                ➕ Ajouter
              </button>
              <button
                className="btn-update"
                onClick={() =>
                  updateCartItem(item.product._id, item.quantity - 1)
                }
                disabled={item.quantity <= 1}
              >
                ➖ Retirer
              </button>
              <button
                className="btn-remove"
                onClick={() => removeFromCart(item.product._id)}
              >
                🗑 Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🧾 Section récapitulative */}
      <div className="cart-summary">
        <h2>🧾 Récapitulatif</h2>
        <p>
          Nombre d’articles : <strong>{totalItems}</strong>
        </p>
        <p>
          Total du panier : <strong>{totalPrice.toFixed(2)} €</strong>
        </p>

        <div className="payment-buttons">
          <button className="btn-stripe">💳 Acheter avec Stripe</button>
          <button className="btn-paypal">🅿️ Acheter avec PayPal</button>
        </div>

        <button className="btn-clear" onClick={clearCart}>
          🧹 Vider le panier
        </button>
      </div>
    </div>
  );
};
