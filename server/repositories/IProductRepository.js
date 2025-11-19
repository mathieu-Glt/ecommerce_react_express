/**
 * Interface/Abstraction for the product repository
 * Set the methods that all implementations must have
 * (e.g., Mongoose, MySQL) to manage products.
 *
 * @interface IProductRepository
 */
class IProductRepository {
  async takeNoteOfUserForProductRepo(productId, userId, star) {
    throw new Error("Method takeRatingFromProductRepo must be implemented");
  }
  async findOrCreateProduct(productData) {
    throw new Error("Method findOrCreateProduct must be implemented");
  }
  async getLatestProducts(limit) {
    throw new Error("Method getLatestProducts must be implemented");
  }

  async getProductByTitle(title) {
    throw new Error("Method getProductByTitle must be implemented");
  }

  async findProduct(query) {
    throw new Error("Method findProduct must be implemented");
  }
  async findProductBySlug(slug) {
    throw new Error("Method findProductBySlug must be implemented");
  }

  async updateProduct(productId, updateData) {
    throw new Error("Method updateProduct must be implemented");
  }

  async findProductsByPriceRange(minPrice, maxPrice) {
    throw new Error("Method findProductsByPriceRange must be implemented");
  }

  async getProducts() {
    throw new Error("Method getProducts must be implemented");
  }

  async createProduct(productData) {
    throw new Error("Method createProduct must be implemented");
  }

  async getProductBySlug(slug) {
    throw new Error("Method getProductBySlug must be implemented");
  }

  async getProductById(productId) {
    throw new Error("Method getProductById must be implemented");
  }

  async deleteProduct(productId) {
    throw new Error("Method deleteProduct must be implemented");
  }

  async findProductsByCategoryIdRepo(categoryId) {
    throw new Error("Method findProductsByCategoryIdRepo must be implemented");
  }

  async findProductsBySubsCategoryIdRepo(subsCategoryId) {
    throw new Error(
      "Method findProductsBySubsCategoryIdRepo must be implemented"
    );
  }

  async findProductsByAverageRateRangeRepo(minRate, maxRate) {
    throw new Error(
      "Method findProductsByAverageRateRangeRepo must be implemented"
    );
  }

  async getTopRatedProductsRepo() {
    throw new Error("Method getTopRatedProductsRepo must be implemented");
  }

  async getProductsByCategoryAccessories() {
    throw new Error(
      "Method getProductsByCategoryAccessories must be implemented"
    );
  }

  async getProductsByCategoryOutillage() {
    throw new Error(
      "Method getProductsByCategoryOutillage must be implemented"
    );
  }
}

module.exports = IProductRepository;
