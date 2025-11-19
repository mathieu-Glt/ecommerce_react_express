/**
 * Interface/Abstraction for the comment repository
 * Set the methods that all implementations must have
 * (e.g., Mongoose, MySQL) to manage comments.
 *
 * @interface ICommentRepository
 */
class ICommentRepository {
  async addComment(commentData) {
    throw new Error("Method addComment must be implemented");
  }
  async getCommentsByProduct(productId) {
    throw new Error("Method getCommentsByProduct must be implemented");
  }
  async getCommentsByUser(userId) {
    throw new Error("Method getCommentsByUser must be implemented");
  }
  async updateComment(commentId, updateData) {
    throw new Error("Method updateComment must be implemented");
  }
  async deleteComment(commentId) {
    throw new Error("Method deleteComment must be implemented");
  }
}

module.exports = ICommentRepository;
