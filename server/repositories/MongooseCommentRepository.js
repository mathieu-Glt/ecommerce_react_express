const ICommentRepository = require("./ICommentRepository");

/**
 * Implémentation Mongoose du repository comment
 */
class MongooseCommentRepository extends ICommentRepository {
  constructor(CommentModel) {
    super();
    this.Comment = CommentModel;
  }

  /**
   * Get all comments.
   * @returns {Promise<Array>} List of comments.
   */
  async getAllComments() {
    return await this.Comment.find()
      .populate("user", "firstname lastname picture")
      .populate("product", "name price")
      .exec();
  }

  /**
   * Create comment.
   * @param {Object} commentData - Data for the new comment
   * @returns {Promise<Object>} The created comment
   */
  async addComment(commentData) {
    const comment = new this.Comment(commentData);
    return await comment.save();
  }

  /**
   * Get comments by product ID.
   * @param {String} productId - ID of the product
   * @returns {Promise<Array>} List of comments for the product
   */
  async getCommentsByProduct(productId) {
    return await this.Comment.find({ product: productId })
      .populate("user", "firstname lastname picture")
      .exec();
  }

  /**
   * Get comments by user ID.
   * @param {String} userId - ID of the user
   * @returns {Promise<Array>} List of comments made by the user
   */
  async getCommentsByUser(userId) {
    return await this.Comment.find({ user: userId })
      .populate("product", "name price")
      .exec();
  }

  /**
   * Update a comment.
   * @param {String} commentId - ID of the comment to update
   * @param {Object} updateData - Data to update the comment
   * @returns {Promise<Object>} The updated comment
   */
  async updateComment(commentId, updateData) {
    return await this.Comment.findByIdAndUpdate(commentId, updateData, {
      new: true,
    }).exec();
  }

  /**
   * Delete a comment.
   * @param {String} commentId - ID of the comment to delete
   * @returns {Promise<Object>} The deleted comment
   */
  async deleteComment(commentId) {
    return await this.Comment.findByIdAndDelete(commentId).exec();
  }
}
module.exports = MongooseCommentRepository;
