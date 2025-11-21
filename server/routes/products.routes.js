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
  takeProductRating,
  findProductsByCategoryId,
  findProductsByAverageRateRange,
  findProductsBySubsCategoryId,
  findProductsByPriceRange,
  getBestSoldProducts,
  getProductsByCategoryAcesories,
  getProductsByCategoryOutillage,
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

// ========================================
// PUBLIC ROUTES - SPECIFIC PATHS FIRST
// ========================================

/**
 * @route GET /
 * @desc Get a list of all products
 * @access Public
 */
router.get("/", getProducts);

/**
 * @route GET /latest
 * @desc Get latest products
 * @access Public
 */
router.get("/latest", getLatestProducts);

/**
 * @route GET /sold-best
 * @desc Get top sold products
 * @access Public
 */
router.get("/sold-best", getBestSoldProducts);

/**
 * @route GET /search
 * @desc Search products by query or slug
 * @access Public
 */
router.get("/search", searchProducts);

/**
 * @route GET /products/search/price
 * @desc Search products by price range
 * @access Public
 */
router.get("/products/search/price", searchProductByPriceRange);

/**
 * @route GET /average-rate
 * @desc Find products by average rate range
 * @access Public
 */
router.get("/average-rate", findProductsByAverageRateRange);

/**
 * @route GET /price-range
 * @desc Search products by price range
 * @access Public
 */
router.get("/price-range", findProductsByPriceRange);

/**
 * @route GET /category/accessories
 * @desc Get top accessories products
 * @access Public
 */
router.get("/category/accessories", getProductsByCategoryAcesories);

/**
 * @route GET /category/outillage
 * @desc Get top outillage products
 * @access Public
 */
router.get("/category/outillage", getProductsByCategoryOutillage);

// ========================================
// PUBLIC ROUTES - DYNAMIC PARAMETERS (MUST BE LAST)
// ========================================

/**
 * @route GET /:id
 * @desc Get product details by ID
 * @access Public
 */
router.get("/:id", getProductById);

// ========================================
// PROTECTED ROUTES - CREATE, UPDATE, DELETE
// ========================================

/**
 * @route POST /
 * @desc Create a new product
 * @access Protected (Admin only)
 * @middleware requireRole(["admin"]), upload.array("images", 5), uploadToCloudinary
 */
router.post(
  "/",
  authenticateToken,
  requireRole(["admin"]),
  upload.array("images", 5),
  uploadToCloudinary,
  createProduct
);

/**
 * @route PUT /:id
 * @desc Update an existing product by ID
 * @access Protected (Admin only)
 * @middleware requireRole(["admin"]), upload.array("images", 5), uploadToCloudinary
 */
router.put(
  "/:id",
  authenticateToken,
  requireRole(["admin"]),
  upload.array("images", 5),
  uploadToCloudinary,
  updateProduct
);

/**
 * @route DELETE /:id
 * @desc Delete a product by ID
 * @access Protected (Admin only)
 * @middleware requireRole(["admin"])
 */
router.delete("/:id", authenticateToken, requireRole(["admin"]), deleteProduct);

// ========================================
// PROTECTED ROUTES - RATINGS
// ========================================

/**
 * @route POST /:id/rate
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
 * @route PUT /:id/rate
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
 * @route GET /:id/rate/check
 * @desc Check if user has rated the product
 * @access Protected (Authenticated users)
 * @middleware requireRole(["user", "admin"])
 */
router.get("/:id/rate/check", authenticateToken, takeProductRating);

// ========================================
// PUBLIC ROUTES - SUB-ROUTES WITH :id PARAMETER
// ========================================

/**
 * @route GET /:id/category
 * @desc Category on a product
 * @access Public
 */
router.get("/:id/category", findProductsByCategoryId);

/**
 * @route GET /:id/subs-category
 * @desc SubsCategory on a product
 * @access Public
 */
router.get("/:id/subs-category", findProductsBySubsCategoryId);

module.exports = router;
