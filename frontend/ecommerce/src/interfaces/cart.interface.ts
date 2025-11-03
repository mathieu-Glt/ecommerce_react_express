import type { Product } from "./product.interface";
import type { User } from "./user.interface";

/**
 * Represents a single product inside the cart.
 */
export interface CartProduct {
  product: Product | string; // string pour l'ObjectId, Product si peuplé
  count: number;
  color?: string;
  price: number;
}

/**
 * Represents a user's shopping cart.
 */
export interface Cart {
  _id?: string; // optionnel car généré par MongoDB
  products: CartProduct[];
  cartTotal: number;
  totalAfterDiscount?: number;
  orderedBy: User | string; // string pour l'ObjectId, User si peuplé
  createdAt?: string;
  updatedAt?: string;
}

export interface AddToCartPayload {
  product: {};
  quantity: number;
  orderBy: string;
}
