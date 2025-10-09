import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_ITEM_QUANTITY,
  CLEAR_CART,
  LOAD_CART_FROM_STORAGE,
} from "../actions/cartActions";

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
};

// Fonction utilitaire pour calculer le total
const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  return { totalItems, totalPrice };
};

// Fonction utilitaire pour sauvegarder dans localStorage
const saveToLocalStorage = (items) => {
  try {
    localStorage.setItem("cart", JSON.stringify(items));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du panier:", error);
  }
};

export const cartReducer = (state = initialState, action) => {
  let newItems;
  let newTotals;

  switch (action.type) {
    case ADD_TO_CART:
      const { product, quantity } = action.payload;
      
      // Vérifier si le produit est déjà dans le panier
      const existingItemIndex = state.items.findIndex(
        (item) => item.product._id === product._id
      );

      if (existingItemIndex >= 0) {
        // Produit déjà présent, mettre à jour la quantité
        newItems = [...state.items];
        newItems[existingItemIndex].quantity += quantity;
      } else {
        // Nouveau produit, l'ajouter
        newItems = [...state.items, { product, quantity }];
      }

      newTotals = calculateTotals(newItems);
      saveToLocalStorage(newItems);

      return {
        ...state,
        items: newItems,
        ...newTotals,
      };

    case REMOVE_FROM_CART:
      newItems = state.items.filter(
        (item) => item.product._id !== action.payload
      );
      newTotals = calculateTotals(newItems);
      saveToLocalStorage(newItems);

      return {
        ...state,
        items: newItems,
        ...newTotals,
      };

    case UPDATE_CART_ITEM_QUANTITY:
      const { productId, quantity: newQuantity } = action.payload;
      
      if (newQuantity <= 0) {
        // Si quantité <= 0, supprimer l'article
        newItems = state.items.filter(
          (item) => item.product._id !== productId
        );
      } else {
        // Sinon, mettre à jour la quantité
        newItems = state.items.map((item) =>
          item.product._id === productId
            ? { ...item, quantity: newQuantity }
            : item
        );
      }

      newTotals = calculateTotals(newItems);
      saveToLocalStorage(newItems);

      return {
        ...state,
        items: newItems,
        ...newTotals,
      };

    case CLEAR_CART:
      localStorage.removeItem("cart");
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };

    case LOAD_CART_FROM_STORAGE:
      newItems = action.payload || [];
      newTotals = calculateTotals(newItems);

      return {
        ...state,
        items: newItems,
        ...newTotals,
      };

    default:
      return state;
  }
};



