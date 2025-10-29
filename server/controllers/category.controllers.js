/**
 * Category Controller
 *
 * Handles all category-related operations:
 * - Retrieve all categories
 * - Retrieve a category by ID or slug
 * - Create new categories
 * - Update existing categories
 * - Delete categories
 *
 * @module controllers/category.controller
 */

const { asyncHandler } = require("../utils/errorHandler");
const CategoryServiceFactory = require("../factories/categoryServiceFactory");

// Create category service based on database type (mongoose or mysql) return instance of CategoryService with appropriate repository
const categoryService = CategoryServiceFactory.createCategoryService(
  process.env.DATABASE_TYPE || "mongoose"
);

/**
 * Get all categories
 *
 * @route GET /categories
 * @access Public
 * @returns {Array} 200 - List of all categoriesa
 * @returns {Object} 404 - No categories found
 */
exports.getCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getCategories();
  if (!categories) {
    return res.status(404).json({ message: "No categories found" });
  }
  res.status(200).json(categories);
});

/**
 * Get a category by slug
 *
 * @route GET /categories/slug/:slug
 * @access Public
 * @param {string} slug - Category slug
 * @returns {Object} 200 - Category details
 * @returns {Object} 404 - Category not found
 * @returns {Object} 500 - Internal server error
 */
exports.getCategoryBySlug = asyncHandler(async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await categoryService.getCategoryBySlug(slug);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, results: category });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

/**
 * Get a category by ID
 *
 * @route GET /categories/:id
 * @access Public
 * @param {string} id - Category ID
 * @returns {Object} 200 - Category details
 * @returns {Object} 404 - Category not found
 * @returns {Object} 500 - Internal server error
 */
exports.getCategoryById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryService.getCategoryById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    res.status(200).json({ success: true, results: category });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

/**
 * Create a new category
 *
 * @route POST /categories
 * @access Admin
 * @param {Object} body - Category data
 * @returns {Object} 201 - Created category
 * @returns {Object} 400 - Failed to create category
 * @returns {Object} 500 - Internal server error
 */
exports.createCategory = asyncHandler(async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to create category" });
    }
    res.status(201).json({ success: true, results: category });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

/**
 * Update an existing category
 *
 * @route PUT /categories/:id
 * @access Admin
 * @param {string} id - Category ID
 * @param {Object} body - Updated category data
 * @returns {Object} 200 - Updated category
 * @returns {Object} 400 - Failed to update category
 * @returns {Object} 500 - Internal server error
 */
exports.updateCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryService.updateCategory(id, req.body);
    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to update category" });
    }
    res.status(200).json({ success: true, results: category });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

/**
 * Delete a category
 *
 * @route DELETE /categories/:id
 * @access Admin
 * @param {string} id - Category ID
 * @returns {Object} 204 - Category deleted successfully
 * @returns {Object} 400 - Failed to delete category
 * @returns {Object} 500 - Internal server error
 */
exports.deleteCategory = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryService.deleteCategory(id);
    if (!category) {
      return res
        .status(400)
        .json({ success: false, message: "Failed to delete category" });
    }
    res
      .status(204)
      .send({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});
