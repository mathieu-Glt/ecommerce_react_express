const express = require("express");
const router = express.Router();

const { requireRole, authenticateToken } = require("../middleware/auth");

/**
 * Comment Routes
 *
 * Handles comment-related endpoints.
 * Includes public endpoints for retrieving comments
 * and protected endpoints for creating, updating,
 * and deleting comments.
 *
 * @module routes/commentRoutes
 */

const {
  getAllComments,
  getCommentsByProduct,
  getCommentsByUser,
  updateComment,
  deleteComment,
  createComment,
} = require("../controllers/comment.controllers");
/**
 * @route GET /comments/
 * @desc Get a list of all comments
 * @access Public
 */
router.get("/", getAllComments);
/**
 * @route GET /comments/product/:productId
 * @desc Get comments for a specific product
 * @access Public
 */
router.get("/product/:productId", getCommentsByProduct);

/**
 * @route GET /comments/user/:userId
 * @desc Get comments made by a specific user
 * @access Public
 */
router.get("/user/:userId", getCommentsByUser);

/**
 * @route POST /comments/
 * @desc Create a new comment
 * @access Protected
 */
router.post("/", authenticateToken, createComment);

/**
 * @route PUT /comments/:commentIt
 * @desc Update an existing comment
 * @access Protected
 */
router.put("/:commentId", authenticateToken, updateComment);

/**
 * @route DELETE /comments/:commentId
 * @desc Delete a comment
 * @access Protected
 */
router.delete("/:commentId", authenticateToken, deleteComment);
module.exports = router;
