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
   * Find top-rated products.
   * @returns {Promise<Array>} Array of top-rated product documents
   */
  async getTopRatedProductsRepo(limit) {
    return await this.Product.find()
      .populate("category", "name slug")
      .populate("sub", "name slug")
      .sort({ "rating.average": -1 })
      .limit(limit)
      .exec();
  }
  /**
   * Find products limit 3 by category accessories
   * @param {number} limit - Number of products to retrieve
   * @returns {Promise<Array>} Array of matching product documents
   */
  async getProductsByCategoryAccessories(limit) {
    return await this.Product.find({ category: "acesories" })
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
  async getProductsByCategoryOutillage(limit) {
    return await this.Product.find({ category: "outillage" })
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

    // Ne construire la clé price que si on a des valeurs
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceQuery = {};
      if (minPrice !== undefined) priceQuery.$gte = Number(minPrice);
      if (maxPrice !== undefined) priceQuery.$lte = Number(maxPrice);
      query.price = priceQuery;
    }

    const results = await this.Product.find(query)
      .populate("category", "name slug")
      .populate("sub", "name slug")
      .exec();

    console.log("Products found in price range - mongoose repo:", results);
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

    if (minRate !== undefined) matchStage.avgRating = { $gte: minRate };
    if (maxRate !== undefined)
      matchStage.avgRating = { ...(matchStage.avgRating || {}), $lte: maxRate };

    const skip = (page - 1) * limit;

    const products = await this.Product.aggregate([
      // Calculer la moyenne des notes
      {
        $addFields: {
          avgRating: { $avg: "$rating.star" },
        },
      },
      // Filtrer par min/max
      { $match: matchStage },
      // Lookup category
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },
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
      // Trier
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
    // On récupère les produits liés à cette catégorie
    const products = await this.Product.find({ category: categoryId })
      .populate("category", "name slug") // optionnel : pour avoir le nom et slug de la catégorie
      .populate("sub", "name slug"); // optionnel : pour les sous-catégories
    return products;
  }

  /**
   *
   * Find products by subs-category id.
   * @param {string} categoryId - subsCategory id
   * @returns {Promise<Array>} Array of matching product documents
   */
  async findProductsBySubCategoryIdRepo(subsCategoryId) {
    // On récupère les produits liés à cette sous-catégorie
    const products = await this.Product.find({ sub: subsCategoryId })
      .populate("category", "name slug") // optionnel : pour avoir le nom et slug de la catégorie
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
    console.log("Repository - getProductBySlug called with slug:", slug);

    const products = await this.Product.find({
      slug: { $regex: slug, $options: "i" },
    })
      .populate("category", "name slug")
      .populate("sub", "name slug");

    if (!products || products.length === 0) {
      return null;
    }

    // Formater les images pour chaque produit
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

    return products; // tableau de produits correspondant à la recherche
  }

  /**
   * Retrieve a product by its title.
   * Populates category and subcategory and formats image paths.
   * @param {string} title - Product title
   * @returns {Promise<Object|null>} Product document or null if not found
   */

  async getProductByTitle(title) {
    console.log("Repository - getProductByTitle called with title:", title);

    const products = await this.Product.find({
      title: { $regex: title, $options: "i" },
    })
      .populate("category", "name slug")
      .populate("sub", "name slug");

    if (!products || products.length === 0) {
      return null;
    }

    // Formater les images pour chaque produit
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
      (r) => r.postedBy.toString() === userId.toString()
    );

    if (existingRating) {
      existingRating.star = star; // Met à jour l'utilisateur seulement
    } else {
      // Si tu veux, tu peux aussi ajouter une nouvelle note si l'utilisateur n'a jamais noté
      product.rating.push({ star, postedBy: userId });
    }

    await product.save();

    const sanitizedRatings = product.rating.map((r) => ({
      star: r.star,
      postedBy: r.postedBy,
    }));

    return {
      ...product.toObject(), // toObject() convertit le document Mongoose en objet JavaScript "pur"
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

    // On pousse simplement la nouvelle note sans toucher aux anciennes
    product.rating.push({ star, postedBy: userId });

    await product.save();

    // Retourner un objet avec rating "propre" si tu veux éviter les _id dans le front
    const sanitizedRatings = product.rating.map((r) => ({
      star: r.star,
      postedBy: r.postedBy,
    }));

    return {
      ...product.toObject(), // toObject() convertit le document
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
    console.log(
      "Repository - takeRatingFromProductRepo called: ",
      productId,
      userId
    );

    const product = await this.Product.findById(productId);
    console.log("Repository - Product fetched: ", product);
    if (!product || !product.rating) {
      console.log("Repository - Product not found");
      return null;
    }

    // Cherche la note de l'utilisateur
    const userRating = product.rating.find(
      (r) => r.postedBy.toString() === userId
    );

    if (!userRating) {
      console.log("Repository - User has not rated this product yet");
      return null; // Important pour éviter l'erreur 500
    }

    console.log("Repository - User rating found: ", userRating);
    return userRating;
  }
}

module.exports = MongooseProductRepository;
