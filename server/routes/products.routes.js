const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductBySlug,
  getProductById,
  updateProduct,
  deleteProduct,
  searchProductByPriceRange,
  getLatestProducts,
  searchProducts,
  rateProduct,
  updateProductRating,
  commentProduct,
  updateCommentProduct,
  deleteCommentProduct,
  takeProductRating,
} = require("../controllers/product.controllers");

// Middlewares
const { requireRole, authenticateToken } = require("../middleware/auth");
const {
  upload,
  uploadToCloudinary,
} = require("../middleware/cloudinaryUpload");

/**
 * Product Routes
 *
 * Handles CRUD operations for products.
 * Includes both public endpoints (view products)
 * and protected endpoints restricted to admin users
 * (create, update, delete).
 *
 * @module routes/productRoutes
 */

/**
 * @route GET /products/
 * @desc Get a list of all products
 * @access Public
 */
router.get("/", getProducts);

/**
 * @route GET /product/slug/:slug
 * @desc Get product details by slug
 * @access Public
 */
router.get("/products/slug/:slug", getProductBySlug);

/**
 * @route GET /product/search
 * @desc Search products by query or slug
 * @access Public
 */
router.get("/products/search", searchProducts);

/**
 * @route GET /product/search/price
 * @desc Search products by price range
 * @access Public
 */
router.get("/products/search/price", searchProductByPriceRange);

/**
 * @route GET /id/:id
 * @desc Get product details by ID
 * @access Public
 */
router.get("/id/:id", getProductById);

/**
 * @route GET /product/lastest
 * @desc Get latest products
 * @access Public
 */
router.get("/latest", getLatestProducts);

/**
 * @route POST /product
 * @desc Create a new product
 * @access Protected (Admin only)
 * @middleware requireRole(["admin"]), upload.array("images", 5), uploadToCloudinary
 */
router.post(
  "/products",
  requireRole(["admin"]),
  upload.array("images", 5),
  uploadToCloudinary,
  createProduct
);

/**
 * @route PUT /product/:id
 * @desc Update an existing product by ID
 * @access Protected (Admin only)
 * @middleware requireRole(["admin"]), upload.array("images", 5), uploadToCloudinary
 */
router.put(
  "/products/:id",
  requireRole(["admin"]),
  upload.array("images", 5),
  uploadToCloudinary,
  updateProduct
);

/**
 * @route DELETE /product/:id
 * @desc Delete a product by ID
 * @access Protected (Admin only)
 * @middleware requireRole(["admin"])
 */
router.delete("/products/:id", requireRole(["admin"]), deleteProduct);

/**
 * @route POST /product/:id/rate
 * @desc Rate a product
 * @access Protected (Authenticated users)
 * @middleware requireRole(["user", "admin"])
 */
router.post(
  "/:id/rate",
  authenticateToken,
  requireRole(["user", "admin"]),
  rateProduct
);

/**
 * @route PUT /product/:id/rate
 * @desc Update a product rating
 * @access Protected (Authenticated users)
 * @middleware requireRole(["user", "admin"])
 */
router.put(
  "/:id/rate",
  authenticateToken,
  requireRole(["user", "admin"]),
  updateProductRating
);

/**
 * @route GET /product/:id/rate/check
 * @desc Check if user has rated the product
 * @access Protected (Authenticated users)
 * @middleware requireRole(["user", "admin"])
 */
router.get("/:id/rate/check", authenticateToken, takeProductRating);

module.exports = router;
