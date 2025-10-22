/**
 * Product Controller
 *
 * Handles all product-related operations:
 * - Retrieve all products
 * - Retrieve a product by ID or slug
 * - Create new products (with image upload via Cloudinary)
 * - Update existing products
 * - Delete products (and remove associated Cloudinary images)
 *
 * @module controllers/product.controller
 */

const { asyncHandler } = require("../utils/errorHandler");
const ProductServiceFactory = require("../factories/productServiceFactory");
const { deleteFromCloudinary } = require("../middleware/cloudinaryUpload");

// Create product service based on database type (mongoose or mysql)
const productService = ProductServiceFactory.createProductService(
  process.env.DATABASE_TYPE || "mongoose"
);

/**
 * Search products by price range
 *
 * @route GET /products/search/price
 * @access Public
 * @queryParam {number} min - Minimum price (optional)
 * @queryParam {number} max - Maximum price (optional)
 * @returns {Array} 200 - List of products within the price range
 * @returns {Object} 400 - Invalid or missing parameters
 * @returns {Object} 404 - No products found
 * @returns {Object} 500 - Internal server error
 */
exports.searchProductByPriceRange = asyncHandler(async (req, res) => {
  const { min, max } = req.query;

  try {
    const minPrice = min ? parseFloat(min) : undefined;
    const maxPrice = max ? parseFloat(max) : undefined;

    if (isNaN(minPrice) && isNaN(maxPrice)) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least a valid min or max price.",
      });
    }

    const products = await productService.getProductsByPriceRange(
      minPrice,
      maxPrice
    );

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found within the given price range.",
      });
    }

    res.status(200).json({
      success: true,
      results: products,
    });
  } catch (error) {
    console.error("Error searching products by price range:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

/**
 * Get 3 latest added products
 *
 * @route GET /products/latest
 * @access Public
 * @returns {Array} 200 - List of latest products
 * @returns {Object} 404 - No products found
 * @returns {Object} 500 - Internal server error
 */
exports.getLatestProducts = asyncHandler(async (req, res) => {
  try {
    const products = await productService.getLatestProducts(3);
    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No products found" });
    }
    res.status(200).json({
      success: true,
      results: products,
    });
  } catch (error) {
    console.error("Error fetching latest products:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

/**
 * Search products by query or slug
 *
 * @route GET /products/search
 * @access Public
 * @param {string} query - Search query or slug
 * @returns {Array} 200 - List of matching products
 * @returns {Object} 404 - No matching products found
 * @returns {Object} 500 - Internal server error
 * @queryParam {string} query - The search query or slug
 */
exports.searchProducts = asyncHandler(async (req, res) => {
  const { query, slug } = req.query;
  try {
    if (!query && !slug) {
      return res.status(400).json({
        success: false,
        message: "Query parameter is required",
      });
    }
    if (slug) {
      const product = await productService.getProductBySlug({ slug });

      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "No matching products found" });
      }
      return res.status(200).json({
        success: true,
        results: [product],
      });
    }

    const searchRegex = new RegExp(query, "i");
    const products = await productService.getProductByQuery(searchRegex);

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No matching products found" });
    }
    res.status(200).json({
      success: true,
      results: products,
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});
/**
 * Get all products
 *
 * @route GET /products
 * @access Public
 * @returns {Array} 200 - List of all products
 * @returns {Object} 404 - No products found
 * @returns {Object} 500 - Internal server error
 */
exports.getProducts = asyncHandler(async (req, res) => {
  try {
    const products = await productService.getProducts();

    if (!products || products.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No products found" });
    }

    res.status(200).json({
      success: true,
      results: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

/**
 * Get a product by slug
 *
 * @route GET /products/slug/:slug
 * @access Public
 * @param {string} slug - Product slug
 * @returns {Object} 200 - Product details
 * @returns {Object} 404 - Product not found
 */
exports.getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const product = await productService.getProductBySlug(slug);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.status(200).json(product);
});

/**
 * Get a product by ID
 *
 * @route GET /products/:id
 * @access Public
 * @param {string} id - Product ID
 * @returns {Object} 200 - Product details
 * @returns {Object} 404 - Product not found
 */
exports.getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await productService.getProductById(id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    results: product, // note que c'est `results` comme les autres routes
  });
});

/**
 * Create a new product
 *
 * @route POST /products
 * @access Admin
 * @param {Object} body - Product data
 * @param {Array} [files] - Uploaded product images
 * @param {Array} [cloudinaryImages] - Images uploaded to Cloudinary
 * @returns {Object} 201 - Created product
 * @returns {Object} 400 - Validation errors
 */
exports.createProduct = asyncHandler(async (req, res) => {
  console.log("Data received in createProduct:");
  console.log("Body:", req.body);
  console.log("Files:", req.files);
  console.log("Cloudinary Images:", req.cloudinaryImages);

  const productData = {
    ...req.body,
    images: req.cloudinaryImages
      ? req.cloudinaryImages.map((img) => img.url) // Extract object img of the request array to get only the url property
      : [],
  };

  console.log("📦 Final ProductData:", productData);

  const product = await productService.createProduct(productData);
  res.status(201).json(product);
});

/**
 * Update an existing product
 *
 * @route PUT /products/:id
 * @access Admin
 * @param {string} id - Product ID
 * @param {Object} body - Updated product data
 * @param {Array} [files] - Uploaded product images
 * @param {Array} [cloudinaryImages] - Updated images uploaded to Cloudinary
 * @returns {Object} 200 - Updated product
 * @returns {Object} 404 - Product not found
 */
exports.updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  console.log("🔍 Data received in updateProduct:");
  console.log("📝 Body:", req.body);
  console.log("📸 Files:", req.files);
  console.log("☁️ Cloudinary Images:", req.cloudinaryImages);

  const productData = {
    ...req.body,
    images: req.cloudinaryImages
      ? req.cloudinaryImages.map((img) => img.url)
      : [],
  };

  console.log("📦 Final ProductData for update:", productData);

  const product = await productService.updateProduct(id, productData);
  res.status(200).json(product);
});

/**
 * Delete a product
 *
 * @route DELETE /products/:id
 * @access Admin
 * @param {string} id - Product ID
 * @returns {Object} 200 - Deleted product
 * @returns {Object} 404 - Product not found
 *
 * Additionally:
 * - If the product has images stored in Cloudinary,
 *   those images are deleted before removing the product from the database.
 */
exports.deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Retrieve product before deletion to fetch associated images
  const product = await productService.getProductById(id);

  if (product && product.images && product.images.length > 0) {
    // Extract Cloudinary public IDs from image URLs
    const publicIds = product.images
      .filter((img) => img.includes("cloudinary"))
      .map((img) => {
        const urlParts = img.split("/");
        const publicIdWithExtension = urlParts[urlParts.length - 1];
        return publicIdWithExtension.split(".")[0]; // Remove file extension
      });

    if (publicIds.length > 0) {
      console.log("🗑️ Deleting Cloudinary images:", publicIds);
      await deleteFromCloudinary(publicIds);
    }
  }

  const deletedProduct = await productService.deleteProduct(id);
  res.status(200).json(deletedProduct);
});

/**
 * Add a rating to a product
 *
 * @route POST /products/:id/rate
 * @access Protected
 * @param {string} id - Product ID
 * @param {Object} body - Rating data
 * @param {number} body.star - Star rating (1-5)
 * @param {string} body.postedBy - User ID of the rater
 * @returns {Object} 200 - Updated product with new rating
 * @returns {Object} 404 - Product not found
 * @returns {Object} 400 - Invalid rating value
 * @returns {Object} 401 - User not authenticated
 * @returns {Object} 500 - Internal server error
 */
exports.rateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { star } = req.body;
  const userId = req.user?._id; // Assuming auth middleware sets req.user
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  if (star < 1 || star > 5) {
    return res.status(400).json({
      success: false,
      message: "Star rating must be between 1 and 5",
    });
  }

  try {
    const updatedProduct = await productService.addRatingToProduct(
      id,
      star,
      userId
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      results: updatedProduct,
    });
  } catch (error) {
    console.error("Error adding rating to product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

/**
 * Update a rating on a product
 * @route PUT /products/:id/rate
 * @access Protected
 * @param {string} id - Product ID
 * @param {Object} body - Updated rating data
 * @param {number} body.star - Updated star rating (1-5)
 * @param {string} body.postedBy - User ID of the rater
 * @returns {Object} 200 - Updated product with modified rating
 * @returns {Object} 404 - Product not found
 * @returns {Object} 400 - Invalid rating value
 * @returns {Object} 401 - User not authenticated
 * @returns {Object} 500 - Internal server error
 */

exports.updateProductRating = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { star } = req.body;
  const userId = req.user?._id; // Assuming auth middleware sets req.user
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }
  if (star < 1 || star > 5) {
    return res.status(400).json({
      success: false,
      message: "Star rating must be between 1 and 5",
    });
  }
  try {
    const updatedProduct = await productService.addRatingToProduct(
      id,
      star,
      userId
    );
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      results: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating rating on product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

/**
 *  Add a comment to a product
 *  @route POST /products/:id/comment
 *  @access Protected
 *  @param {string} id - Product ID
 * @param {string} userId - ID of the user posting the comment
 * @param {Object} body - Comment data
 * @param {string} body.text - Comment text
 * @param {string} body.postedBy - User ID of the commenter
 * @returns {Object} 200 - Updated product with new comment
 * @returns {Object} 404 - Product not found
 * @returns {Object} 400 - Invalid comment data
 * @returns {Object} 401 - User not authenticated
 * @returns {Object} 500 - Internal server error
 */

exports.commentProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const userId = req.user?._id; // Assuming auth middleware sets req.user
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }
  if (!text || text.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Comment text cannot be empty",
    });
  }
  try {
    const updatedProduct = await productService.addCommentToProduct(
      id,
      text,
      userId
    );
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      results: updatedProduct,
    });
  } catch (error) {
    console.error("Error adding comment to product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

/**
 * Update a comment on a product
 * @route PUT /products/:id/comment/:commentId
 * @access Protected
 * @param {string} id - Product ID
 * @param {string} commentId - Comment ID
 * @param {string} userId - ID of the user updating the comment
 * @param {Object} body - Updated comment data
 * @param {string} body.text - Updated comment text
 * @returns {Object} 200 - Updated product with modified comment
 * @returns {Object} 404 - Product or comment not found
 * @returns {Object} 400 - Invalid comment data
 * @returns {Object} 401 - User not authenticated
 * @returns {Object} 500 - Internal server error
 */

exports.updateCommentProduct = asyncHandler(async (req, res) => {
  const { id, commentId } = req.params;
  const { text } = req.body;
  const userId = req.user?._id; // Assuming auth middleware sets req.user
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }
  if (!text || text.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Comment text cannot be empty",
    });
  }
  try {
    const updatedProduct = await productService.updateCommentOnProductService(
      id,
      commentId,
      text,
      userId
    );
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product or comment not found",
      });
    }
    res.status(200).json({
      success: true,
      results: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating comment on product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

/**
 *  Delete a comment on a product
 *  @route DELETE /products/:id/comment/:commentId
 *  @access Protected
 * @param {string} id - Product ID
 * @param {string} commentId - Comment ID
 * @param {string} userId - ID of the user deleting the comment
 * @returns {Object} 200 - Updated product with comment removed
 * @returns {Object} 404 - Product or comment not found
 * @returns {Object} 401 - User not authenticated
 * @returns {Object} 500 - Internal server error
 */

exports.deleteCommentProduct = asyncHandler(async (req, res) => {
  const { id, commentId } = req.params;
  const userId = req.user?._id; // Assuming auth middleware sets req.user
  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }
  try {
    const updatedProduct = await productService.deleteCommentOnProductService(
      id,
      commentId,
      userId
    );
    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product or comment not found",
      });
    }
    res.status(200).json({
      success: true,
      results: updatedProduct,
    });
  } catch (error) {
    console.error("Error deleting comment on product:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});
