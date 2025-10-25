/**
 * Comment Controller
 *
 * Handles all comment-related operations:
 * - Retrieve all comments
 * - Retrieve a commnet by ID
 * - Create new comment
 * - Update existing comments
 * - Delete comments
 *
 * @module controllers/comment.controller
 */

const { asyncHandler } = require("../utils/errorHandler");
const CommentServiceFactory = require("../factories/commentServiceFactory");

// Create CommentService instance based on configured database
const commentService = CommentServiceFactory.createCommentService(
  process.env.DATABASE_TYPE || "mongoose"
);

/**
 * Get all products
 *
 * @route GET /products
 * @access Public
 * @returns {Array} 200 - List of all products
 * @returns {Object} 404 - No products found
 * @returns {Object} 500 - Internal server error
 */
exports.getAllComments = asyncHandler(async (req, res) => {
  try {
    const comments = await commentService.getAllComments();

    if (!comments && comments.length === 0) {
      return res.status(404).json({ message: "No comments found" });
    }

    res.status(200).json({
      success: true,
      data: {
        comments,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

/**
 * Get comments by product ID
 * @route GET /comments/product/:productId
 * @access Public
 * @returns {Array} 200 - List of comments for the product
 * @returns {Object} 404 - No comments found for the product
 * @returns {Object} 500 - Internal server error
 */
exports.getCommentsByProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  try {
    const comments = await commentService.getCommentsByProduct(productId);

    if (!comments || comments.length === 0) {
      return res
        .status(404)
        .json({ message: "No comments found for this product" });
    }
    res.status(200).json({
      success: true,
      data: {
        comments,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

/**
 * Get comments by user ID
 * @route GET /comments/user/:userId
 * @access Public
 * @returns {Array} 200 - List of comments made by the user
 * @returns {Object} 404 - No comments found for the user
 * @returns {Object} 500 - Internal server error
 */
exports.getCommentsByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  try {
    const comments = await commentService.getCommentsByUser(userId);

    if (!comments || comments.length === 0) {
      return res
        .status(404)
        .json({ message: "No comments found for this user" });
    }
    res.status(200).json({
      success: true,
      data: {
        comments,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

/**
 * Create a new comment
 * @route POST /comments/
 * @access Protected (Authenticated users)
 */
exports.createComment = asyncHandler(async (req, res) => {
  const commentData = req.body;
  try {
    const newComment = await commentService.addComment(commentData);
    res.status(201).json({
      success: true,
      data: {
        comment: newComment,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

/**
 * Update a comment
 * @route PUT /comments/:commentId
 * @access Protected (Authenticated users)
 * @returns {Object} 200 - Updated comment
 * @returns {Object} 404 - Comment not found
 * @returns {Object} 500 - Internal server error
 */
exports.updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const updateData = req.body;
  try {
    const updatedComment = await commentService.updateComment(
      commentId,
      updateData
    );
    if (!updatedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json({
      success: true,
      data: {
        comment: updatedComment,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

/**
 * Delete a comment
 * @route DELETE /comments/:commentId
 * @access Protected (Admin only)
 * @returns {Object} 200 - Deleted comment
 * @returns {Object} 404 - Comment not found
 * @returns {Object} 500 - Internal server error
 */
exports.deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  try {
    const deletedComment = await commentService.deleteComment(commentId);
    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        comment: deletedComment,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});
