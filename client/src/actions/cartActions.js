// Actions Redux pour la gestion du panier

// Types d'actions
export const ADD_TO_CART = "ADD_TO_CART";
export const REMOVE_FROM_CART = "REMOVE_FROM_CART";
export const UPDATE_CART_ITEM_QUANTITY = "UPDATE_CART_ITEM_QUANTITY";
export const CLEAR_CART = "CLEAR_CART";
export const LOAD_CART_FROM_STORAGE = "LOAD_CART_FROM_STORAGE";

// Ajouter un produit au panier
export const addToCart = (product, quantity = 1) => {
  return {
    type: ADD_TO_CART,
    payload: {
      product,
      quantity,
    },
  };
};

// Supprimer un produit du panier
export const removeFromCart = (productId) => {
  return {
    type: REMOVE_FROM_CART,
    payload: productId,
  };
};

// Mettre à jour la quantité d'un produit dans le panier
export const updateCartItemQuantity = (productId, quantity) => {
  return {
    type: UPDATE_CART_ITEM_QUANTITY,
    payload: {
      productId,
      quantity,
    },
  };
};

// Vider le panier
export const clearCart = () => {
  return {
    type: CLEAR_CART,
  };
};

// Charger le panier depuis le localStorage
export const loadCartFromStorage = (cartItems) => {
  return {
    type: LOAD_CART_FROM_STORAGE,
    payload: cartItems,
  };
};



