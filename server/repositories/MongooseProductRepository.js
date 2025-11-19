const IProductRepository = require("./IProductRepository");
const mongoose = require("mongoose");

/**
 * Mongoose-based implementation of the Product Repository.
 *
 * This class handles all product-related database operations using
 * a Mongoose model. It extends the IProductRepository abstraction
 * to ensure the service layer does not depend on the database implementation.
 * @extends {IProductRepository}
 * @module repositories/MongooseProductRepository
 *
 *
 */
class MongooseProductRepository extends IProductRepository {
  /**
   * @param {mongoose.Model} ProductModel - Mongoose Product model
   */
  constructor(ProductModel) {
    super();
    this.Product = ProductModel;
  }

  /**
   * Find products matching a query.
   * @param {Object} query - Mongoose query object
   * @returns {Promise<Array>} Array of matching product documents
   */
  async findProduct(query) {
    return await this.Product.find(query)
      .populate("category", "name slug") // Replace the category ID with an object containing only `name` and `slug` of Entity Category in related collection
      .populate("sub", "name slug") // Same for the field `sub`
      .exec();
  }

  /**
   * Find last products 3 added.
   * @param {number} limit - Number of products to retrieve
   * @returns {Promise<Array>} Array of latest product documents
   */
  async getLatestProducts(limit) {
    return await this.Product.find()
      .populate("category", "name slug") // JOINTURE Replace the category ID with an object containing only `name` and `slug` of Entity Category in related collection
      .populate("sub", "name slug") // jointure Same for the field `sub`
      .sort({ createdAt: -1 }) // Sort by newest first
      .limit(limit) // If limit equals 3, take the last 3 products
      .exec();
  }

  /**
   * Find top-rated products.
   * @returns {Promise<Array>} Array of top-rated product documents
   */
  async getTopRatedProductsRepo(limit) {
    return await this.Product.find()
      .populate("category", "name slug") // JOINTURE Replace the category ID with an object containing only `name` and `slug` of Entity Category in related collection
      .populate("sub", "name slug") // jointure Same for the field `sub`
      .sort({ "rating.average": -1 }) // Sort by average rating descending from highest to lowest
      .limit(limit)
      .exec();
  }
  /**
   * Find products limit 3 by category accessories
   * @param {number} limit - Number of products to retrieve
   * @returns {Promise<Array>} Array of matching product documents
   */
  async getProductsByCategoryAccessories(limit, categoryId) {
    const accessoriesCategoryId = new mongoose.Types.ObjectId(
      "68af139bad37cf7ede6bd1ef"
    ); // Replace with the actual ID of the "accessories" category
    return await this.Product.find({ category: categoryId })
      .populate("category", "name slug")
      .populate("sub", "name slug")
      .limit(limit)
      .exec();
  }

  /**
   * Find products limit 3 by category outillage
   * @param {number} limit - Number of products to retrieve
   * @returns {Promise<Array>} Array of matching product documents
   */
  async getProductsByCategoryOutillage(limit, categoryId) {
    const outillageCategoryId = new mongoose.Types.ObjectId(
      "68b1a8a7ee346bc5b9809b51"
    ); // Replace with the actual ID of the "outillage" category
    return await this.Product.find({ category: categoryId })
      .populate("category", "name slug")
      .populate("sub", "name slug")
      .limit(limit)
      .exec();
  }

  /**
   * Find products within a specified price range.
   * @param {number} minPrice - Minimum price
   * @param {number} maxPrice - Maximum price
   */
  async findProductsByPriceRangeRepo(minPrice, maxPrice) {
    const query = {};

    // Only build the price key if we have values
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceQuery = {};
      if (minPrice !== undefined) priceQuery.$gte = Number(minPrice); // Ensure it's a number and not a string $gte for "greater than or equal"
      if (maxPrice !== undefined) priceQuery.$lte = Number(maxPrice); // $lte for "less than or equal"
      query.price = priceQuery; // Add the price key to the main query so priceQuery contains $gte and/or $lte
      // ex: { price: { $gte: 100, $lte: 500 } } so priceQuery = { $gte: 100, $lte: 500 }
    }

    const results = await this.Product.find(query) // this.Product.find({ price: { $gte: minPrice, $lte: maxPrice } })
      .populate("category", "name slug") // Replace the category ID with an object containing only `name` and `slug` of Entity Category in related collection
      .populate("sub", "name slug") // Same for the field `sub`
      .exec();

    return results;
  }

  /**
   * Find a product by its slug.
   * @param {string} slug - Product slug
   * @returns {Promise<Object|null>} Product document or null if not found
   */
  async findProductBySlug(slug) {
    return await this.Product.findOne({ slug })
      .populate("category", "name slug")
      .populate("sub", "name slug")
      .exec();
  }

  /**
   * Find products by average rating range with pagination and sorting
   * @param {number} minRate - Minimum average rating
   * @param {number} maxRate - Maximum average rating
   * @param {number} page - Page number (default 1)
   * @param {number} limit - Number of products per page (default 10)
   * @param {string} sortField - Field to sort by (default 'avgRating')
   * @param {number} sortOrder - 1 for ascending, -1 for descending (default -1)
   */
  async findProductsByAverageRateRangeRepo({
    minRate,
    maxRate,
    page = 1,
    limit = 10,
    sortField = "avgRating",
    sortOrder = -1,
  }) {
    const matchStage = {};

    if (minRate !== undefined) matchStage.avgRating = { $gte: minRate }; // If minRate is defined
    if (maxRate !== undefined)
      // If maxRate is defined
      matchStage.avgRating = { ...(matchStage.avgRating || {}), $lte: maxRate }; // Copy the existing object if there is minRate and add $lte
    // ex: { avgRating: { $gte: 3, $lte: 5 } } or just { avgRating: { $lte: 5 } } or { avgRating: { $gte: 3 } }
    const skip = (page - 1) * limit; // Calculate the number of documents to skip for pagination page - 1 because page 1 should skip 0 documents

    const products = await this.Product.aggregate([
      // Calculate the average rating
      {
        $addFields: {
          avgRating: { $avg: "$rating.star" }, // Add an avgRating field and calculate the average of stars in the rating array
        },
      },
      // Filter by min/max
      { $match: matchStage },
      // Lookup Join with another collection category
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" }, // Unwind the resulting array: assuming there is only one category per product e.g., categoryInfo: [ { name: "Electronics", slug: "electronics" } ] becomes categoryInfo: { name: "Electronics", slug: "electronics" }
      // So flattening an array means taking the first element of the array and putting it directly at the root of the document e.g., { categoryInfo: [ {...} ] } => { categoryInfo: {...} }
      // Lookup sub-category
      {
        $lookup: {
          from: "subs",
          localField: "sub",
          foreignField: "_id",
          as: "subInfo",
        },
      },
      { $unwind: "$subInfo" },
      // Sort by given field and order ascending or descending
      { $sort: { [sortField]: sortOrder } },
      // Pagination
      { $skip: skip },
      { $limit: limit },
    ]);

    return products;
  }

  /**
   *
   * Find products by category id.
   * @param {string} categoryId - Category id
   * @returns {Promise<Array>} Array of matching product documents
   */
  async findProductsByCategoryIdRepo(categoryId) {
    // We retrieve the products related to this category
    const products = await this.Product.find({ category: categoryId })
      .populate("category", "name slug") // optional: to get the name and slug of the category
      .populate("sub", "name slug"); // optional: for subcategories
    return products;
  }

  /**
   *
   * Find products by subs-category id.
   * @param {string} categoryId - subsCategory id
   * @returns {Promise<Array>} Array of matching product documents
   */
  async findProductsBySubCategoryIdRepo(subsCategoryId) {
    // We retrieve the products related to this subcategory
    const products = await this.Product.find({ sub: subsCategoryId })
      .populate("category", "name slug") // optional: to get the name and slug of the category
      .populate("sub", "name slug");
    return products;
  }

  /**
   * Retrieve all products from the database, populated with category and subcategory.
   * Also transforms image paths into complete URLs.
   * @returns {Promise<Array>} Array of product documents
   */
  async getProducts() {
    const products = await this.Product.find()
      .populate("category", "name slug")
      .populate("sub", "name slug")
      .sort({ createdAt: -1 }); // Sort by creation date descending, most recent first

    return products.map((product) => {
      const prod = product.toJSON(); // Convert the Mongoose document to a plain JavaScript object, the opposite would be product.toObject() which also converts to a plain JS object

      // Pictures: add prefix if necessary
      if (prod.images && prod.images.length > 0) {
        prod.images = prod.images.map((image) => {
          if (!image.startsWith("/uploads/") && !image.startsWith("http")) {
            return `/uploads/${image}`;
          }
          return image;
        });
      }

      // Ensure that averageRating and commentsCount are always numbers
      if (!prod.rating || prod.rating.length === 0) {
        prod.averageRating = 0;
      } else {
        // Calculate the average only if item.star exists
        const total = prod.rating.reduce(
          (acc, item) => acc + (item.star || 0),
          0
        );
        prod.averageRating = total / prod.rating.length;
      }

      prod.commentsCount = prod.commentsCount || 0;

      return prod;
    });
  }

  /**
   * Retrieve a product by its slug.
   * Populates category and subcategory and formats image paths.
   * @param {string} slug - Product slug
   * @returns {Promise<Object|null>} Product document or null if not found
   */
  async getProductBySlug(slug) {
    const products = await this.Product.find({
      slug: { $regex: slug, $options: "i" }, // case-insensitive search "i"
    })
      .populate("category", "name slug")
      .populate("sub", "name slug");

    if (!products || products.length === 0) {
      return null;
    }

    // Format images for each product
    products.forEach((p) => {
      if (p?.images?.length > 0) {
        p.images = p.images.map((image) => {
          if (!image.startsWith("/uploads/") && !image.startsWith("http")) {
            return `/uploads/${image}`;
          }
          return image;
        });
      }
    });

    return products; // array of products matching the search
  }

  /**
   * Retrieve a product by its title.
   * Populates category and subcategory and formats image paths.
   * @param {string} title - Product title
   * @returns {Promise<Object|null>} Product document or null if not found
   */

  async getProductByTitle(title) {
    const products = await this.Product.find({
      title: { $regex: title, $options: "i" },
    })
      .populate("category", "name slug")
      .populate("sub", "name slug");

    if (!products || products.length === 0) {
      return null;
    }

    // Format images for each product
    products.forEach((p) => {
      if (p?.images?.length > 0) {
        p.images = p.images.map((image) => {
          if (!image.startsWith("/uploads/") && !image.startsWith("http")) {
            return `/uploads/${image}`;
          }
          return image;
        });
      }
    });

    return products;
  }

  /**
   * Create a new product in the database.
   * @param {Object} productData - Product data
   * @returns {Promise<Object>} Created product document
   */
  async createProduct(productData) {
    return await this.Product.create(productData);
  }

  /**
   * Find a product by title or create a new one if it doesn't exist.
   * @param {Object} productData - Product data
   * @returns {Promise<Object>} Found or created product document
   */
  async findOrCreateProduct(productData) {
    const { title } = productData;
    const product = await this.Product.findOne({ title });
    if (!product) {
      return await this.Product.create(productData);
    }
    return product;
  }

  /**
   * Update a product by its ID.
   * @param {string} productId - Product ID
   * @param {Object} updateData - Fields to update
   * @returns {Promise<Object|null>} Updated product document or null if not found
   */
  async updateProduct(productId, updateData) {
    return await this.Product.findByIdAndUpdate(productId, updateData, {
      new: true, // Return the updated document
    });
  }

  /**
   * Retrieve a product by its unique ID.
   * @param {string} productId - Product ID
   * @returns {Promise<Object|null>} Product document or null if not found
   */
  async getProductById(productId) {
    return await this.Product.findById(productId);
  }

  /**
   * Delete a product by its unique ID.
   * @param {string} productId - Product ID
   * @returns {Promise<Object|null>} Deleted product document or null if not found
   */
  async deleteProduct(productId) {
    return await this.Product.findByIdAndDelete(productId);
  }

  /**
   * Update a rating to a product.
   * @param {string} productId - Product ID
   * @param {Object} star - Rating data (star)
   * @param {string} userId - ID of the user posting the rating
   *
   * @returns {Promise<Object|null>} Updated product document or null if not found
   */
  async updateRatingToProductRepo(productId, userId, star) {
    const product = await this.Product.findById(productId);
    if (!product) return null;

    const existingRating = product.rating.find(
      (r) => r.postedBy.toString() === userId.toString() // To compare ObjectId as strings to check if the user has already rated the product
    );

    if (existingRating) {
      existingRating.star = star; // Update the user's rating only
    } else {
      // If you want, you can also add a new rating if the user has never rated before
      product.rating.push({ star, postedBy: userId });
    }

    await product.save();

    // Return an object with "clean" rating if you want to avoid _id in the front
    const sanitizedRatings = product.rating.map((r) => ({
      star: r.star,
      postedBy: r.postedBy,
    }));

    return {
      ...product.toObject(), // toObject() converts the Mongoose document to a "plain" JavaScript object
      rating: sanitizedRatings,
    };
  }

  /**
   * Post a rating to a product.
   * @param {string} productId - Product ID
   * @param {Object} star - Rating data (star)
   * @param {string} userId - ID of the user posting the rating
   *
   * @returns {Promise<Object|null>} Updated product document or null if not found
   */
  async addRatingToProductRepo(productId, userId, star) {
    const product = await this.Product.findById(productId);
    if (!product) return null;

    // We simply push the new rating without touching the old ones
    product.rating.push({ star, postedBy: userId });

    await product.save();

    // Return an object with "clean" rating if you want to avoid _id in the front
    const sanitizedRatings = product.rating.map((r) => ({
      star: r.star,
      postedBy: r.postedBy,
    }));

    return {
      ...product.toObject(), // toObject() converts the Mongoose document to a "plain" JavaScript object
      rating: sanitizedRatings,
    };
  }

  /**
   * Take note of a user for a product.
   * @param {string} productId - Product ID
   * @param {Object} commentData - Comment data (text, postedBy)
   * @returns {Promise<Object|null>} Updated product document or null if not found
   */
  async takeRatingFromProductRepo(productId, userId) {
    const product = await this.Product.findById(productId);
    if (!product || !product.rating) {
      return null;
    }

    // Find the user's rating
    const userRating = product.rating.find(
      (r) => r.postedBy.toString() === userId
    );

    if (!userRating) {
      return null; // Important to avoid 500 error
    }

    return userRating;
  }
}

module.exports = MongooseProductRepository;
