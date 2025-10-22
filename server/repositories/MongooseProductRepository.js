const IProductRepository = require("./IProductRepository");

/**
 * Mongoose-based implementation of the Product Repository.
 *
 * This class handles all product-related database operations using
 * a Mongoose model. It extends the IProductRepository abstraction
 * to ensure the service layer does not depend on the database implementation.
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
      .populate("category", "name slug") // Replace the category ID with an object containing only `name` and `slug` of Entity Category in related collection
      .populate("sub", "name slug") // Same for the field `sub`
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  /**
   * Find products within a specified price range.
   * @param {number} minPrice - Minimum price
   * @param {number} maxPrice - Maximum price
   */
  async findProductsByPriceRange(minPrice, maxPrice) {
    const priceQuery = {};
    if (minPrice !== undefined) {
      priceQuery.$gte = minPrice;
    }
    if (maxPrice !== undefined) {
      priceQuery.$lte = maxPrice;
    }
    return await this.Product.find({ price: priceQuery })
      .populate("category", "name slug")
      .populate("sub", "name slug")
      .exec();
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
   * Retrieve all products from the database, populated with category and subcategory.
   * Also transforms image paths into complete URLs.
   * @returns {Promise<Array>} Array of product documents
   */
  async getProducts() {
    const products = await this.Product.find()
      .populate("category", "name slug")
      .populate("sub", "name slug")
      .sort({ createdAt: -1 });

    return products.map((product) => {
      const prod = product.toJSON();
      console.log("Processing product:", prod);

      // Images : ajouter le préfixe si nécessaire
      if (prod.images && prod.images.length > 0) {
        prod.images = prod.images.map((image) => {
          if (!image.startsWith("/uploads/") && !image.startsWith("http")) {
            return `/uploads/${image}`;
          }
          return image;
        });
      }

      // ⚡ Assurer que averageRating et commentsCount sont toujours des nombres
      if (!prod.rating || prod.rating.length === 0) {
        prod.averageRating = 0;
      } else {
        // Calculer la moyenne uniquement si item.star existe
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
    const product = await this.Product.findOne({ slug })
      .populate("category", "name slug")
      .populate("sub", "name slug");

    if (product?.images?.length > 0) {
      product.images = product.images.map((image) => {
        if (!image.startsWith("/uploads/") && !image.startsWith("http")) {
          return `/uploads/${image}`;
        }
        return image;
      });
    }

    return product;
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
   * Add a rating to a product.
   * @param {string} productId - Product ID
   * @param {Object} star - Rating data (star)
   * @param {string} userId - ID of the user posting the rating
   *
   * @returns {Promise<Object|null>} Updated product document or null if not found
   */
  async addRatingToProductRepo(productId, userId, star) {
    const product = await this.Product.findById(productId);
    if (!product) {
      return null;
    }
    const existingRating = product.ratings.find(
      (r) => r.postedBy.toString() === userId.toString()
    );

    if (existingRating) {
      existingRating.star = star; // update
    } else {
      product.ratings.push({ star, postedBy: userId });
    }

    await product.save();

    // Recalcul automatique de la moyenne via le virtual "averageRating"
    const productObj = product.toObject({ virtuals: true });
    return productObj;
  }

  /**
   * Add a comment to a product.
   * @param {string} productId - Product ID
   * @param {Object} commentData - Comment data (text, postedBy)
   * @returns {Promise<Object|null>} Updated product document or null if not found
   */
  async addCommentToProductRepo(productId, commentData) {
    const product = await this.Product.findById(productId);
    if (!product) {
      return null;
    }
    product.comments.push(commentData);
    await product.save();
    return product;
  }

  /**
   * Update a comment on a product.
   * @param {string} productId - Product ID
   * @param {string} commentId - Comment ID
   * @param {Object} updateData - Fields to update in the comment (e.g., text)
   * @returns {Promise<Object|null>} Updated product document or null if not found
   */
  async updateCommentOnProductRepo(productId, commentId, updateData) {
    const product = await this.Product.findById(productId);
    if (!product) {
      return null;
    }
    const comment = product.comments.id(commentId);
    if (!comment) {
      return null;
    }
    Object.assign(comment, updateData);
    await product.save();
    return product;
  }

  /**
   * Delete a comment from a product.
   * @param {string} productId - Product ID
   * @param {string} commentId - Comment ID
   * @param {Object} updateData - Fields to update in the comment (e.g., text)
   * @returns {Promise<Object|null>} Updated product document with deleted comment or null if not found
   */

  async deleteCommentFromProductRepo(productId, commentId) {
    const product = await this.Product.findById(productId);
    if (!product) {
      return null;
    }
    const comment = product.comments.id(commentId);
    if (!comment) {
      return null;
    }
    comment.remove();
    await product.save();
    return product;
  }
}

module.exports = MongooseProductRepository;
