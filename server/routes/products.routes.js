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
} = require("../controllers/product.controllers");

// Middlewares
const { requireRole } = require("../middleware/auth");
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
 * @route GET /products
 * @desc Get a list of all products
 * @access Public
 */
router.get("/products", getProducts);

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
 * @route POST /product/lastest
 * @desc Get latest products
 * @access Public
 */
router.post("/products/latest", getLatestProducts);

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

module.exports = router;
