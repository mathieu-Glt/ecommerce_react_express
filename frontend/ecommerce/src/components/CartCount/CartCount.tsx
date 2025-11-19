import React, { useEffect, useState } from "react";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import "./cart-counter.css";

function CartCount() {
  const { cart } = useLocalStorage();
  const [totalItems, setTotalItems] = useState(0);
  useEffect(() => {
    if (cart && Array.isArray(cart)) {
      {
        /* Calculate total quantity of items in the cart */
      }
      const total = cart.reduce(
        (sum: number, item: any) => sum + (item.quantity || 0),
        0
      );
      setTotalItems(total);
    }
  }, [cart]);

  return (
    <div className="cart-container">
      {totalItems > 0 && <div className="cart-badge">{totalItems}</div>}
    </div>
  );
}

export default CartCount;
