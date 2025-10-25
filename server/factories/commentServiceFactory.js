const CommentService = require("../services/commentService");
const MongooseCommentRepository = require("../repositories/MongooseCommentRepository");

/**
 * Factory responsible for creating the appropriate CommentService
 * depending on the configured database type (Mongoose or MySQL).
 * This class ensures that the service is always instantiated
 * with the correct repository implementation, while hiding
 * the underlying database details from the rest of the application.
 * @class CommentServiceFactory
 */
class CommentServiceFactory {
  /**
   * Create a CommentService instance backed by Mongoose.
   * @returns {CommentService} An instance of CommentService using MongooseCommentRepository
   * @throws {Error} If the Mongoose service creation fails
   **/
  static createMongooseCommentService() {
    try {
      const Comment = require("../models/Comment");
      const commentRepository = new MongooseCommentRepository(Comment);
      return new CommentService(commentRepository);
    } catch (error) {
      console.error("Error creating Mongoose comment service:", error);
      throw new Error("Failed to create Mongoose comment service");
    }
  }

  /**
   * Create a CommentService instance backed by MySQL.
   * Uses a MySQL connection and initializes the repository
   * before injecting it into the service.
   * @returns {CommentService} An instance of CommentService using MySQLCommentRepository
   * @throws {Error} If the MySQL service creation fails
   * **/
  static createMySQLCommentService() {
    try {
      const mysql = require("mysql2/promise");
      const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      });
      const commentRepository = new MySQLCommentRepository(connection);
      return new CommentService(commentRepository);
    } catch (error) {
      console.error("Error creating MySQL comment service:", error);
      throw new Error("Failed to create MySQL comment service");
    }
  }

  /**
   * Create a CommentService based on the configured database type.
   * @returns {CommentService} An instance of CommentService
   * @throws {Error} If the database type is unsupported
   * **/
  static createCommentService() {
    const dbType = process.env.DB_TYPE || "mongoose";
    if (dbType === "mongoose") {
      return this.createMongooseCommentService();
    } else if (dbType === "mysql") {
      return this.createMySQLCommentService();
    } else {
      throw new Error(`Unsupported DB_TYPE: ${dbType}`);
    }
  }
}
module.exports = CommentServiceFactory;
