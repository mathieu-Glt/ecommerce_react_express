/**
 * @file ProductService.js
 * @description
 * Product Service
 *
 * Provides an abstraction layer for product-related operations.
 * Delegates data access to an injected repository implementation
 * (e.g., MongoDB, MySQL, or any other storage system).
 *
 * Responsibilities:
 *  - Fetching products (all, by slug, by ID)
 *  - Creating new products
 *  - Updating existing products
 *  - Deleting products
 *  - Supporting "find or create" logic
 *
 * Dependencies:
 *  - IProductRepository (interface/abstraction)
 *
 * This service follows the Dependency Inversion Principle (SOLID),
 * ensuring it does not depend on low-level implementation details.
 */

/**
 * Product Service
 * @class ProductService
 */
class ProductService {
  /**
   * Initializes ProductService with a repository abstraction.
   * @param {Object} productRepository - Repository abstraction for product operations.
   */
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  /**
   * Retrieve all products.
   * @returns {Promise<Array>} List of products.
   */
  async getProducts() {
    return await this.productRepository.getProducts();
  }

  /**
   * Retrieve a product by its slug.
   * @param {string} slug - Unique slug identifier for the product.
   * @returns {Promise<Object|null>} Product object or null if not found.
   */
  async getProductBySlug(slug) {
    console.log("Service - getProductBySlug called with slug:", slug);
    return await this.productRepository.getProductBySlug(slug);
  }

  /**
   * Retrieve a product by its title.
   * @param {string} title - Unique title identifier for the product.
   * @returns {Promise<Object|null>} Product object or null if not found.
   */
  async getProductByTitle(title) {
    console.log("Service - getProductByTitle called with title:", title);
    return await this.productRepository.getProductByTitle(title);
  }

  /**
   * Retrieve products within a specified price range.
   * @param {number} minPrice - Minimum price.
   * @param {number} maxPrice - Maximum price.
   * @returns {Promise<Array>} List of products within the price range.
   */
  async getProductsByPriceRange(minPrice, maxPrice) {
    return await this.productRepository.getProductsByPriceRange(
      minPrice,
      maxPrice
    );
  }

  /**
   * Retrieve the latest added products.
   * @param {number} limit - Number of latest products to retrieve.
   * @returns {Promise<Array>} List of latest products.
   */
  async getLatestProducts(limit) {
    return await this.productRepository.getLatestProducts(limit);
  }

  /**
   * Create a new product.
   * @param {Object} productData - Product details (name, slug, price, description, etc.).
   * @returns {Promise<Object>} Created product object.
   */
  async createProduct(productData) {
    return await this.productRepository.createProduct(productData);
  }

  /**
   * Find a product by query parameters.
   * @param {Object} query - Query parameters to find the product.
   * @returns {Promise<Object|null>} Found product object or null if not found.
   */
  async getProductByQuery(query) {
    return await this.productRepository.findProduct(query);
  }

  /**
   * Find a product by slug parameter.
   * @param {string} slug - Slug parameter to find the product.
   * @returns {Promise<Object|null>} Found product object or null if not found.
   */
  async getProductBySlug(slug) {
    return await this.productRepository.findProductBySlug(slug);
  }

  /**
   * Find a product by unique data or create it if it does not exist.
   * @param {Object} productData - Product details to match or create.
   * @returns {Promise<Object>} Found or newly created product.
   */
  async findOrCreateProduct(productData) {
    return await this.productRepository.findOrCreateProduct(productData);
  }

  /**
   * Update a product by ID.
   * @param {string} productId - Product ID.
   * @param {Object} updateData - Fields to update (e.g., price, stock, description).
   * @returns {Promise<Object|null>} Updated product object or null if not found.
   */
  async updateProduct(productId, updateData) {
    return await this.productRepository.updateProduct(productId, updateData);
  }

  /**
   * Retrieve a product by its ID.
   * @param {string} productId - Product ID.
   * @returns {Promise<Object|null>} Product object or null if not found.
   */
  async getProductById(productId) {
    return await this.productRepository.getProductById(productId);
  }

  /**
   * Delete a product by its ID.
   * @param {string} productId - Product ID.
   * @returns {Promise<Object>} Deletion result (may vary depending on repository implementation).
   */
  async deleteProduct(productId) {
    return await this.productRepository.deleteProduct(productId);
  }

  /**
   * Upadate a rating to a product.
   * @param {string} productId - Product ID.
   * @param {Object} ratingData - Rating details (star, postedBy).
   * @returns {Promise<Object|null>} Updated product object with new rating or null if not found.
   */
  async updateRatingToProduct(productId, userId, star) {
    return await this.productRepository.updateRatingToProductRepo(
      productId,
      userId,
      star
    );
  }

  /**
   * Take a rating from user for a product .
   * @param {string} productId - Product ID.
   * @param {Object} ratingData - Rating details (star, postedBy).
   * @returns {Promise<Object|null>} Updated product object with new rating or null if not found.
   */
  async takeRatingFromProduct(productId, userId) {
    const result = await this.productRepository.takeRatingFromProductRepo(
      productId,
      userId
    );
    console.log("Service result for takeRatingFromProduct:", result);
    return result;
  }

  /**
   * Find products by its Category Slug.
   * @param {string} categoryId - Category Id.
   * @returns {Promise<Array>} List of products in the specified category.
   */
  async findProductsByCategorySlugService(categoryId) {
    return await this.productRepository.findProductsByCategoryIdRepo(
      categoryId
    );
  }

  /**
   * Find products by its subs-Category Slug.
   * @param {string} subCategoryId - subsCategory Id.
   * @returns {Promise<Array>} List of products in the specified category.
   */
  async findProductsBySubCategoryIdService(subCategoryId) {
    return await this.productRepository.findProductsBySubCategoryIdRepo(
      subCategoryId
    );
  }

  /**
   * Find products by average rate min and max range.
   * @param {Object} [params={}] - Parameters for finding products.
   * @param {number} params.minRate - Minimum average rate.
   * @param {number} params.maxRate - Maximum average rate.
   * @param {number} [params.page=1] - Page number for pagination.
   * @param {number} [params.limit=10] - Number of products per page.
   * @param {string} [params.sortField='avgRating'] - Field to sort by.
   * @param {number} [params.sortOrder=-1] - Sort order (1 for ascending, -1 for descending).
   * @returns {Promise<Array>} List of products within the average rate range.
   */
  async findProductsByAverageRateRangeService({
    minRate,
    maxRate,
    page = 1,
    limit = 10,
    sortField = "avgRating",
    sortOrder = -1,
  } = {}) {
    return await this.productRepository.findProductsByAverageRateRangeRepo({
      minRate,
      maxRate,
      page,
      limit,
      sortField,
      sortOrder,
    });
  }

  /**
   * Finf  product by price range service
   * @typedef {Object} FindProductsByPriceRangeService
   * @property {function(number, number): Promise<Array>} findProductsByPriceRangeService - Finds products within a specified price range.
   * @param {number} minPrice - Minimum price.
   * @param {number} maxPrice - Maximum price.
   * @returns {Promise<Array>} List of products within the price range.
   */
  async findProductsByPriceRangeService(minPrice, maxPrice) {
    const results = await this.productRepository.findProductsByPriceRangeRepo(
      minPrice,
      maxPrice
    );
    console.log(
      "Service - findProductsByPriceRangeService results Service:",
      results
    );
    return results;
  }
}

module.exports = ProductService;
