/**
 * Interface/Abstraction pour le repository comment
 * Définit les méthodes que toutes les implémentations doivent avoir
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
