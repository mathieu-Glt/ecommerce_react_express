const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

/**
 * Comment Schema
 *
 * Un commentaire appartient à un seul utilisateur et un seul produit.
 * Un utilisateur ne peut commenter qu'une seule fois le même produit.
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

// 🔒 Empêche qu’un utilisateur commente deux fois le même produit
commentSchema.index({ product: 1, user: 1 }, { unique: true });

// Vérifie existence du produit et de l'utilisateur avant sauvegarde
commentSchema.pre("save", async function (next) {
  const Product = mongoose.model("Product");
  const User = mongoose.model("User");

  try {
    const [productExists, userExists] = await Promise.all([
      Product.exists({ _id: this.product }),
      User.exists({ _id: this.user }),
    ]);

    if (!productExists)
      return next(new Error(`Produit avec l'ID ${this.product} introuvable.`));
    if (!userExists)
      return next(new Error(`Utilisateur avec l'ID ${this.user} introuvable.`));

    next();
  } catch (err) {
    next(err);
  }
});

// Nettoyage de sortie JSON
commentSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("Comment", commentSchema);
