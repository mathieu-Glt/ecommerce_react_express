const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

/**
 * Product Schema
 *
 * Represents a product in the system, with details such as pricing,
 * description, inventory, category/sub-category relationships, images,
 * shipping options, color, and brand.
 *
 * Supports virtuals for easy access to related Category and Sub documents,
 * and enforces relational integrity through pre-save hooks.
 *
 * @typedef {Object} Product
 * @property {string} title - Product title (required, max 32 characters, searchable)
 * @property {string} slug - Unique URL-friendly identifier (lowercased, indexed)
 * @property {number} price - Product price (required, indexed)
 * @property {string} description - Product description (required, max 2000 characters, searchable)
 * @property {ObjectId} category - Reference to Category (required)
 * @property {ObjectId} sub - Reference to Sub-category (required)
 * @property {number} quantity - Available stock quantity
 * @property {number} sold - Number of products sold (default: 0)
 * @property {Array} images - Array of image URLs or Cloudinary info
 * @property {string} shipping - "Yes" or "No" indicating shipping availability
 * @property {string} color - Product color (enum: Black, Brown, Silver, Blue, White, Green)
 * @property {string} brand - Product brand (enum: Apple, Samsung, Microsoft, Lenovo, Asus, Dell, HP, Acer)
 * @property {Array} rating - Array of rating objects containing star and postedBy (User reference)
 * @property {Array} comments - Array of comment objects containing text, postedBy (User reference), and createdAt
 * @property {Date} createdAt - Auto-generated creation timestamp
 * @property {Date} updatedAt - Auto-generated update timestamp
 *
 * @virtual categoryInfo - Populated Category object
 * @virtual subInfo - Populated Sub-category object
 */
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 32,
      text: true,
    },
    slug: { type: String, unique: true, lowercase: true, index: true },
    price: { type: Number, required: true, trim: true, index: true },
    description: { type: String, required: true, maxlength: 2000, text: true },
    category: { type: ObjectId, ref: "Category", required: true },
    sub: { type: ObjectId, ref: "Sub", required: true },
    quantity: Number,
    sold: { type: Number, default: 0 },
    images: { type: Array },
    shipping: { type: String, enum: ["Yes", "No"] },
    color: {
      type: String,
      enum: ["Black", "Brown", "Silver", "Blue", "White", "Green"],
    },
    brand: {
      type: String,
      enum: [
        "Apple",
        "Samsung",
        "Microsoft",
        "Lenovo",
        "Asus",
        "Dell",
        "HP",
        "Acer",
      ],
    },
    rating: [
      {
        star: Number,
        postedBy: { type: ObjectId, ref: "User" },
      },
    ],
    comments: [
      {
        text: String,
        postedBy: { type: ObjectId, ref: "User" },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Virtuals for relational population
productSchema.virtual("categoryInfo", {
  ref: "Category",
  localField: "category",
  foreignField: "_id",
  justOne: true,
});

productSchema.virtual("subInfo", {
  ref: "Sub",
  localField: "sub",
  foreignField: "_id",
  justOne: true,
});

// Enable virtuals in JSON and Object outputs
productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

/**
 * Pre-save hook
 * - Validates that category and sub-category exist
 * - Ensures sub-category belongs to the given category
 * @throws {Error} If category or sub-category is invalid or inconsistent
 */
productSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("category") || this.isModified("sub")) {
    const Category = mongoose.model("Category");
    const Sub = mongoose.model("Sub");

    try {
      const category = await Category.findById(this.category);
      if (!category)
        throw new Error(`Category with ID ${this.category} does not exist`);

      const sub = await Sub.findById(this.sub);
      if (!sub)
        throw new Error(`Sub-category with ID ${this.sub} does not exist`);

      if (sub.parent.toString() !== this.category.toString()) {
        throw new Error(
          `Sub-category "${sub.name}" does not belong to category "${category.name}"`
        );
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});
/**
 * Virtual property to calculate average rating
 * - Computes the average star rating from the ratings array
 */
productSchema.virtual("averageRating").get(function () {
  if (!this.rating) return 0;

  if (Array.isArray(this.rating) && this.rating.length > 0) {
    const total = this.rating.reduce((acc, item) => acc + (item.star || 0), 0);
    return total / this.rating.length;
  }

  // Support temporaire pour les anciens produits où rating est un nombre
  if (typeof this.rating === "number") {
    return this.rating;
  }

  return 0;
});

/**
 * Count comments virtual
 * - Returns the number of comments on the product
 *
 */
productSchema.virtual("commentsCount").get(function () {
  return this.comments.length;
});

/**
 * Pre-remove hook
 * - Placeholder to clean up related references (e.g., reviews, orders)
 */
productSchema.pre("remove", async function (next) {
  // Implement cleanup logic if necessary
  next();
});

module.exports = mongoose.model("Product", productSchema);
