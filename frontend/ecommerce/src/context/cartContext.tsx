// src/context/CartContext.tsx
import { createContext, useContext, useState } from "react";
import { useCart as useCartHook } from "../hooks/useCart";
import type { Cart } from "../interfaces/cart.interface";

interface CartContextType {
  cart: Cart[];
  loading: boolean;
  error: string | null;
  getUserCart: () => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    cart,
    loading,
    error,
    getUserCart,
    addToCart,
    removeFromCart,
    clearCart,
    updateCartItem,
  } = useCartHook();

  // ✅ Optionnel : si tu veux maintenir un petit état local (ex: open/close cart drawer)
  const [isCartOpen, setIsCartOpen] = useState(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  console.log("🛒 CartProvider rendered, cart:", cart);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        getUserCart,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
