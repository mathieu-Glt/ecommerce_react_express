import React, { useEffect } from "react";
import { useCart } from "../hooks/useCart";
import { useLocalStorage } from "../hooks/useLocalStorage";

export const CartPage = () => {
  const {
    cart,
    loading,
    error,
    getUserCart,
    updateCartItem,
    removeFromCart,
    clearCart,
  } = useCart();
  const { user } = useLocalStorage();

  useEffect(() => {
    if (user?._id) {
      console.log("👤 Utilisateur connecté :", user);
      console.log("🛒 ID de l'utilisateur :", user._id);

      // Exemple : récupérer le panier de cet utilisateur
      getUserCart();
    }
  }, [user, getUserCart]);

  return (
    <div>
      <h1>Mon panier</h1>
    </div>
  );
};
