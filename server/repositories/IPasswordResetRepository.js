/**
 * Interface/Abstraction for the password reset token repository
 * Set the methods that all implementations must have
 * (e.g., Mongoose, MySQL) to manage password reset tokens.
 *
 * @interface IPasswordResetRepository
 */
class IPasswordResetRepository {
  async createPasswordResetToken(userId, token, hashedToken) {
    throw new Error("Method createPasswordResetToken must be implemented");
  }

  async getPasswordResetToken(token) {
    throw new Error("Method getPasswordResetToken must be implemented");
  }

  async deletePasswordResetToken(token) {
    throw new Error("Method deletePasswordResetToken must be implemented");
  }

  async deletePasswordResetTokenById(tokenId) {
    throw new Error("Method deletePasswordResetTokenById must be implemented");
  }

  async deletePasswordResetTokensByUserId(userId) {
    throw new Error(
      "Method deletePasswordResetTokensByUserId must be implemented"
    );
  }
}

module.exports = IPasswordResetRepository;
