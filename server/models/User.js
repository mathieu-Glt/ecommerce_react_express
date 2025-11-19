const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * User Schema
 *
 * Manages local, Google, and Azure authentication.
 * Stores user information including role and activation status .
 *
 * @typedef {Object} User
 * @property {string} googleId - ID Google for OAuth2 authentication
 * @property {string} azureId - ID Azure for OAuth2 authentication
 * @property {string} accessToken - OAuth2 access token
 * @property {string} refreshToken - OAuth2 refresh token
 * @property {string} avatar - URL of the user's avatar
 * @property {string} firstname - User's first name
 * @property {string} lastname - User's last name (in uppercase)
 * @property {string} picture - URL of the profile picture
 * @property {string} email - User's unique email address (required)
 * @property {Array} cart - User's cart contents
 * @property {string} address - User's address
 * @property {string} password - Hashed password (required if no AzureId or GoogleId)
 * @property {string} role - User's role (admin or user)
 * @property {boolean} isActive - User's activation status
 * @property {Date} createdAt - Creation timestamp
 * @property {Date} updatedAt - Last update timestamp
 *
 */
const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, trim: true },
    azureId: { type: String, sparse: true, unique: true },
    accessToken: { type: String, trim: true },
    avatar: { type: String, trim: true },
    refreshToken: { type: String, trim: true },
    firstname: { type: String, trim: true },
    lastname: { type: String, trim: true },
    picture: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    cart: { type: Array, default: [] },
    address: { type: String, default: "" },
    password: {
      type: String,
      trim: true,
      required: function () {
        return !this.azureId && !this.googleId;
      },
    },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// 🔠 Uppercase lastname avant validation
userSchema.pre("validate", function (next) {
  if (this.lastname) this.lastname = this.lastname.trim().toUpperCase();
  next();
});

// 🔐 Hashage mot de passe
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (
    this.password &&
    (this.password.startsWith("$2a$") || this.password.startsWith("$2b$"))
  )
    return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (err) {
    next(err);
  }
});

// 🧍‍♂️ Avatar par défaut si non défini
userSchema.methods.getProfilePicture = function () {
  if (this.picture) return this.picture;
  const initials = `${this.firstname?.[0] || ""}${
    this.lastname?.[0] || ""
  }`.toUpperCase();
  return `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff&size=200`;
};

// 🧩 Virtual : commentaires de l’utilisateur
userSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "user",
  justOne: false,
});

// 🔒 Nettoyage des données
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.refreshToken;
  delete user.accessToken;
  return user;
};

module.exports = mongoose.model("User", userSchema);
