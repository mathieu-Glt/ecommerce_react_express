import React, { useMemo } from "react";
import { useCart } from "../hooks/useCart";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { loadStripe } from "@stripe/stripe-js";
import "./styles/cartpage.css";

// ⚙️ Chargement asynchrone de Stripe avec la clé publique depuis .env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const CartPage = () => {
  const { cart, loading, error, updateCartItem, removeFromCart, clearCart } =
    useCart();
  const { user } = useLocalStorage();

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

  // ✅ Paiement Stripe
  const handleStripePayment = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/payment/stripe/create-checkout-session`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cart.map((item) => ({
              name: item.name, // correspond au backend
              price: Number(item.product.price), // s'assure que c'est un nombre
              quantity: Number(item.quantity) || 1,
            })),
          }),
        }
      );

      const data = await res.json();

      if (data?.url) {
        // Redirection directe vers Stripe Checkout
        window.location.href = data.url;
      } else {
        console.error("Réponse Stripe invalide :", data);
        alert("Erreur lors de la création de la session Stripe");
      }
    } catch (err) {
      console.error("Erreur Stripe:", err);
      alert("Erreur lors du paiement Stripe");
    }
  };

  // ✅ Paiement PayPal
  // ✅ Paiement PayPal - Frontend
  const handlePaypalPayment = async () => {
    try {
      // 1️⃣ Appel à ton backend pour créer l'ordre PayPal
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/payment/paypal`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: totalPrice }), // totalPrice = montant à payer
        }
      );

      const data = await res.json();
      console.log("Réponse PayPal :", data);

      // 2️⃣ Vérifier si l'ordre a bien été créé
      if (data?.success && data?.id) {
        // 3️⃣ Rediriger l'utilisateur vers PayPal pour payer
        window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${data.id}`;
      } else {
        console.error(
          "Erreur création ordre PayPal :",
          data?.error || "unknown"
        );
        alert("Impossible de lancer le paiement PayPal");
      }
    } catch (err) {
      console.error("Erreur PayPal:", err);
      alert("Erreur lors du paiement PayPal");
    }
  };

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

      <div className="cart-summary">
        <h2>🧾 Récapitulatif</h2>
        <p>
          Nombre d’articles : <strong>{totalItems}</strong>
        </p>
        <p>
          Total du panier : <strong>{totalPrice.toFixed(2)} €</strong>
        </p>

        <div className="payment-buttons">
          <button className="btn-stripe" onClick={handleStripePayment}>
            💳 Acheter avec Stripe
          </button>
          <button className="btn-paypal" onClick={handlePaypalPayment}>
            🅿️ Acheter avec PayPal
          </button>
        </div>

        <button className="btn-clear" onClick={clearCart}>
          🧹 Vider le panier
        </button>
      </div>
    </div>
  );
};
