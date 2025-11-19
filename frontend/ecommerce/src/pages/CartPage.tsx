import React, { useMemo } from "react";
import { useCart } from "../hooks/useCart";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { loadStripe } from "@stripe/stripe-js";
import { useApi } from "../hooks/useApi"; // ✅ AJOUT
import "./styles/cartpage.css";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const CartPage = () => {
  const { cart, loading, error, updateCartItem, removeFromCart, clearCart } =
    useCart();
  const { user } = useLocalStorage();
  const api = useApi();

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

  if (loading) return <p>Loading cart...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!cart || cart.length === 0) return <p>Your cart is empty</p>;

  // Stripe Payment
  const handleStripePayment = async () => {
    try {
      const response = await api.post(
        "/payment/stripe/create-checkout-session",
        {
          items: cart.map((item) => ({
            name: item.name,
            price: Number(item.product.price),
            quantity: Number(item.quantity) || 1,
          })),
        }
      );

      const data = response.data;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert("Erreur lors de la création de la session Stripe");
      }
    } catch (err) {
      alert("Erreur lors du paiement Stripe");
    }
  };

  // PayPal Payment
  const handlePaypalPayment = async () => {
    try {
      const response = await api.post("/payment/paypal", {
        amount: totalPrice,
      });

      const data = response.data;

      if (data?.success && data?.id) {
        window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${data.id}`;
      } else {
        alert("Impossible de lancer le paiement PayPal");
      }
    } catch (err) {
      alert("Erreur lors du paiement PayPal");
    }
  };

  return (
    <div className="cart-page">
      <h1>🛒 My Cart</h1>

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
              <p>Unit Price: {item.product.price} €</p>
              <p>Quantity: {item.quantity}</p>
              <p>Total: {(item.product.price * item.quantity).toFixed(2)} €</p>
            </div>

            <div className="cart-card-actions">
              <button
                className="btn-update"
                onClick={() =>
                  updateCartItem(item.product._id, item.quantity + 1)
                }
              >
                ➕ Add
              </button>
              <button
                className="btn-update"
                onClick={() =>
                  updateCartItem(item.product._id, item.quantity - 1)
                }
                disabled={item.quantity <= 1}
              >
                ➖ Remove
              </button>
              <button
                className="btn-remove"
                onClick={() => removeFromCart(item.product._id)}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <h2>🧾 Summary</h2>
        <p>
          Number of items: <strong>{totalItems}</strong>
        </p>
        <p>
          Cart total: <strong>{totalPrice.toFixed(2)} €</strong>
        </p>

        <div className="payment-buttons">
          <button className="btn-stripe" onClick={handleStripePayment}>
            💳 Pay with Stripe
          </button>
          <button className="btn-paypal" onClick={handlePaypalPayment}>
            🅿️ Pay with PayPal
          </button>
        </div>

        <button className="btn-clear" onClick={clearCart}>
          🧹 Clear Cart
        </button>
      </div>
    </div>
  );
};
