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
    const { limit } = req.body || {};
    const limitNumber = limit && !isNaN(limit) ? parseInt(limit) : 3;
    const products = await productService.getLatestProducts(limitNumber);
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
 * Get 3 products best sold
 *
 * @route GET /products/sell/best
 * @access Public
 * @returns {Array} 200 - List of best sold products
 * @returns {Object} 404 - No products found
 * @returns {Object} 500 - Internal server error
 */
exports.getBestSoldProducts = asyncHandler(async (req, res) => {
  try {
    // const { limit } = req.body || {};
    const limitNumber = 3;
    const products = await productService.getTopRatedProducts(limitNumber);
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
    console.error("Error fetching best sold products:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});
/**
 * Get 3 products better rated
 *
 * @route GET /products/sell/latest
 * @access Public
 * @returns {Array} 200 - List of latest products
 * @returns {Object} 404 - No products found
 * @returns {Object} 500 - Internal server error
 */
exports.getBestRatedProducts = asyncHandler(async (req, res) => {
  try {
    const { limit } = req.body || {};
    const limitNumber = limit && !isNaN(limit) ? parseInt(limit) : 3;
    const products = await productService.getBestRatedProducts(limitNumber);
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
    console.error("Error fetching best rated products:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

/**
 * Get 3 products by category acesories
 *
 * @route GET /products/acesories
 * @access Public
 * @returns {Array} 200 - List of best sold products
 * @returns {Object} 404 - No products found
 * @returns {Object} 500 - Internal server error
 */
exports.getProductsByCategoryAcesories = asyncHandler(async (req, res) => {
  try {
    const limitNumber = 3;
    const products = await productService.getProductsByCategoryAccessories(
      limitNumber
    );
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
    console.error("Error fetching products by category acesories:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

/**
 * Find products by category outillage limit 3
 * @route GET /products/outillage
 * @access Public
 * @returns {Array} 200 - List of products by category outillage
 * @returns {Object} 404 - No products found
 * @returns {Object} 500 - Internal server error
 */
exports.getProductsByCategoryOutillage = asyncHandler(async (req, res) => {
  try {
    const limitNumber = 3;
    const products = await productService.getProductsByCategoryOutillage(
      limitNumber
    );
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
    console.error("Error fetching products by category outillage:", error);
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
  const { title, slug } = req.query;
  console.log("Search parameters received:", { title, slug });
  try {
    if (!title && !slug) {
      return res.status(400).json({
        success: false,
        message: "Query parameter is required",
      });
    }
    if (slug) {
      console.log("Searching product by slug:", slug);
      const product = await productService.getProductBySlug(slug);
      console.log("Product found by slug:", product);

      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "No matching products found" });
      }
      return res.status(200).json({
        success: true,
        results: [product],
      });
    } else if (title) {
      console.log("Searching products by title:", title);
      const product = await productService.getProductByTitle(title);
      console.log("Product found by slug:", product);

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
  const userId = req.user?.userId;
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
      userId,
      star
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
  const { isUpdate } = req.body;
  console.log("isUpdate received:", isUpdate);
  const userId = req.user?.userId;
  console.log(
    "Updating rating for product:",
    id,
    "by user:",
    userId,
    "with star:",
    star
  );
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
    const updatedProduct = await productService.updateRatingToProduct(
      id,
      userId,
      star
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
 * Find products by Category Id
 * @route GET /products/:id/category
 * @access Public
 * @param {string} id - Category Id
 * @returns {Array} 200 - List of products in the specified category
 * @returns {Object} 404 - No products found in the specified category
 * @returns {Object} 500 - Internal server error
 */
exports.findProductsByCategoryId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const products = await productService.findProductsByCategorySlugService(id);
    console.log("Products found for category ID", id, ":", products);
    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found in the specified category",
      });
    }
    res.status(200).json({
      success: true,
      results: products,
    });
  } catch (error) {
    console.error("Error fetching products by category slug:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

/**
 * Find products by subsCategory Id
 * @route GET /products/:id/subs-category
 * @access Public
 * @param {string} id - subsCategory Id
 * @returns {Array} 200 - List of products in the specified subs category
 * @returns {Object} 404 - No products found in the specified subs category
 * @returns {Object} 500 - Internal server error
 */
exports.findProductsBySubsCategoryId = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const products = await productService.findProductsBySubCategoryIdService(
      id
    );
    console.log("Products found for subsCategory ID", id, ":", products);
    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found in the specified subs category",
      });
    }
    res.status(200).json({
      success: true,
      results: products,
    });
  } catch (error) {
    console.error("Error fetching products by subs category id:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

/**
 * Find products list by average range min and max rate
 * @route GET /products/average-rate
 * @access Public
 * @param {number} minRate - Minimum average rate
 * @param {number} maxRate - Maximum average rate
 * @returns {Array} 200 - List of products within the average rate range
 * @returns {Object} 404 - No products found within the average rate range
 * @returns {Object} 500 - Internal server error
 */
// exports.findProductsByAverageRateRange = asyncHandler(async (req, res) => {
//   const { minRate, maxRate } = req.body;
//   try {
//     const min = minRate ? parseFloat(minRate) : 0;
//     const max = maxRate ? parseFloat(maxRate) : 5;
//     const products = await productService.findProductsByAverageRateRangeService(
//       min,
//       max
//     );
//     console.log("Products found by average rate range B:", products);

//     if (!products || products.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No products found within the average rate range",
//       });
//     }
//     res.status(200).json({
//       success: true,
//       results: products,
//     });
//   } catch (error) {
//     console.error("Error fetching products by average rate range:", error);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     });
//   }
// });

/**
 * Take a rate from user for a product
 * @route GET /products/:id/rate
 * @access Protected
 * @param {string} id - Product ID
 * @param {Object} body - Rating data
 * @param {number} body.star - Star rating (1-5)
 * @param {string} body.postedBy - User ID of the rater
 * @returns {Boolean} true - User has rated the product
 * @returns {Boolean} false - User has not rated the product
 * @returns {Object} 404 - Product not found
 * @returns {Object} 200 - hasRated status
 * @returns {Object} 500 - Internal server error
 *
 */

exports.takeProductRating = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    const product = await productService.takeRatingFromProduct(id, userId);
    console.log(" Controoler - Product retrieved for rating check:", product);

    if (!product)
      return res.status(200).json({ success: false, hasRated: false });

    const userRating =
      product.postedBy._id.toString() === userId ? product : null;
    console.log("Controller - User rating found:", userRating);

    if (!userRating) {
      return res.status(200).json({ success: true, hasRated: false });
    } else {
      return res
        .status(200)
        .json({ success: true, hasRated: true, rating: userRating });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * Find products list by average range min and max rate
 * @route GET /products/average-rate
 * @access Public
 * @param {number} minRate - Minimum average rate
 * @param {number} maxRate - Maximum average rate
 * @param {number} page - Page number for pagination
 * @param {number} limit - Number of items per page
 * @returns {Array} 200 - List of products within the average rate range
 * @returns {Object} 404 - No products found within the average rate range
 * @returns {Object} 500 - Internal server error
 */
exports.findProductsByAverageRateRange = asyncHandler(async (req, res) => {
  const { minRate, maxRate, page, limit } = req.query;

  try {
    const products = await productService.findProductsByAverageRateRangeService(
      {
        minRate: minRate ? parseFloat(minRate) : 0,
        maxRate: maxRate ? parseFloat(maxRate) : 5,
        page: page ? parseInt(page) : 1,
        limit: limit ? parseInt(limit) : 10,
      }
    );
    console.log("Products found by average rate range A:", products);
    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found within the average rate range",
      });
    }

    res.status(200).json({
      success: true,
      results: products,
    });
  } catch (error) {
    console.error("Error fetching products by average rate range:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});

/**
 * Find products by price range
 * @route GET /products/price-range
 * @access Public
 * @param {number} min - Minimum price
 * @param {number} max - Maximum price
 * @returns {Array} 200 - List of products within the price range
 * @returns {Object} 404 - No products found within the price range
 * @returns {Object} 500 - Internal server error
 */
exports.findProductsByPriceRange = asyncHandler(async (req, res) => {
  const { minPrice, maxPrice } = req.query;
  try {
    const products = await productService.findProductsByPriceRangeService(
      minPrice ? parseFloat(minPrice) : undefined,
      maxPrice ? parseFloat(maxPrice) : undefined
    );
    console.log("Products found by price range Controller:", products);
    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found within the price range",
      });
    }
    res.status(200).json({
      success: true,
      results: products,
    });
  } catch (error) {
    console.error("Error fetching products by price range:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
});
