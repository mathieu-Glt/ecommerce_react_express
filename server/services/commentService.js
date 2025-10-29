/**
 * @file CommentService.js
 * @description
 * Comment Service
 *
 * Provides an abstraction layer for comment-related operations.
 * Delegates data access to an injected repository implementation
 * (e.g., MongoDB, MySQL, or any other storage system).
 *
 * Responsibilities:
 *  - Fetching comments by User (all, by slug, by ID)
 *  - Fetching comments by Products (all, by slug, by ID)
 *  - Creating new comment
 *  - Updating existing comment
 *  - Deleting comment
 *  - Supporting "find or create" logic
 *
 * Dependencies:
 *  - ICommentRepository (interface/abstraction)
 *
 * This service follows the Dependency Inversion Principle (SOLID),
 * ensuring it does not depend on low-level implementation details.
 */

/**
 * Comment Service
 * @class CommentService
 */

class CommentService {
  /**
   * Initializes CommentService with a repository abstraction.
   * @param {Object} commentRepository - Repository abstraction for comment operations.
   */
  constructor(commentRepository) {
    this.commentRepository = commentRepository;
  }
  /**
   * Create a new comment.
   * @param {Object} commentData - Comment details (text, user, product, etc.).
   * @returns {Promise<Object>} Created comment object.
   *
   */
  async addComment(commentData) {
    console.log("commentData dans service :", commentData);
    return await this.commentRepository.addComment(commentData);
  }
  /**
   * Find a comment by user ID and product ID.
   * @param {String} userId - ID of the user.
   * @param {String} productId - ID of the product.
   */
  async getCommentByUserAndProduct(userId, productId) {
    return await this.commentRepository.getCommentByUserAndProduct(
      userId,
      productId
    );
  }

  /**
   * Update an existing comment.
   * @param {String} commentId - ID of the comment to update.
   * @param {Object} updateData - Updated comment details.
   * @returns {Promise<Object>} The updated comment object.
   */
  async updateComment(commentId, updateData) {
    return await this.commentRepository.updateComment(commentId, updateData);
  }
  /**
   * Get all comments.
   * @returns {Promise<Array>} List of comments.
   *
   */
  async getAllComments() {
    return await this.commentRepository.getAllComments();
  }

  /**
   * Get comments by product ID.
   * @param {String} productId - ID of the product
   * @returns {Promise<Array>} List of comments for the product
   */
  async getCommentsByProduct(productId) {
    return await this.commentRepository.getCommentsByProduct(productId);
  }

  /**
   * Get comments by user ID.
   * @param {String} userId - ID of the user
   * @returns {Promise<Array>} List of comments made by the user
   */
  async getCommentsByUser(userId) {
    return await this.commentRepository.getCommentsByUser(userId);
  }

  /**
   * Delete a comment.
   * @param {String} commentId - ID of the comment to delete
   * @returns {Promise<Object>} The deleted comment
   **/
  async deleteCommentService(commentId) {
    return await this.commentRepository.deleteCommentRepo(commentId).exec();
  }
}

module.exports = CommentService;
