/**
 * Cart Model
 * Represents a shopping cart with products, total amounts, and the user who ordered it.
 * Associates products with their details like count, color, and price.
 * References User and Product models.
 *
 * @typedef {Object} Cart
 * @property {Array<Object>} products - List of products in the cart with details
 * @property {number} cartTotal - Total amount of the cart before discounts
 * @property {number} totalAfterDiscount - Total amount after applying discounts
 * @property {ObjectId} orderedBy - Reference to the User who owns the cart
 * @property {Date} createdAt - Timestamp of cart creation
 * @property {Date} updatedAt - Timestamp of last cart update
 *
 *
 * @module models/Cart
 *
 */

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: { type: ObjectId, ref: "Product" },
      count: Number,
      color: String,
      price: Number,
    },
  ],
  cartTotal: Number,
  totalAfterDiscount: Number,
  orderedBy: { type: ObjectId, ref: "User" },
});

module.exports = mongoose.model("Cart", cartSchema);
