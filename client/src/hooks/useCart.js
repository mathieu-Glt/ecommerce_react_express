import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadCartFromStorage } from "../actions/cartActions";

export const useCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  // Charger le panier depuis le localStorage au démarrage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        dispatch(loadCartFromStorage(cartItems));
      }
    } catch (error) {
      console.error("Erreur lors du chargement du panier:", error);
    }
  }, [dispatch]);

  return cart;
};



