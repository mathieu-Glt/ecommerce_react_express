const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

/**
 * Comment Schema
 *
 * A comment belongs to only one user and one product.
 * A user can only comment once on the same product.
 * The schema includes validations for the text and rating.
 * There are hooks to verify the existence of the product and user before saving.
 *
 * @typedef {Object} Comment
 * @property {ObjectId} product - Reference to the Product document (mandatory)
 * @property {ObjectId} user - Reference to the User document (mandatory)
 * @property {string} text - Comment text (mandatory, max 1000 characters)
 * @property {number} rating - Product rating (between 1 and 5)
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 *
 */
const commentSchema = new mongoose.Schema(
  {
    product: { type: ObjectId, ref: "Product", required: true },
    user: { type: ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    rating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

// Prevent a user from commenting twice on the same product
commentSchema.index({ product: 1, user: 1 }, { unique: true });

// Verify existence of product and user before saving
commentSchema.pre("save", async function (next) {
  const Product = mongoose.model("Product");
  const User = mongoose.model("User");

  try {
    const [productExists, userExists] = await Promise.all([
      Product.exists({ _id: this.product }),
      User.exists({ _id: this.user }),
    ]);

    if (!productExists)
      return next(new Error(`Product with ID ${this.product} not found.`));
    if (!userExists)
      return next(new Error(`User with ID ${this.user} not found.`));

    next();
  } catch (err) {
    next(err);
  }
});

// JSON output cleanup
commentSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("Comment", commentSchema);
