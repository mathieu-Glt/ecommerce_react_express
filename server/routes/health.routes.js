/**
 * Health Check Route
 * Provides a simple endpoint to verify the API is running
 * Used by monitoring services and for quick status checks
 *
 * @route GET /api/health
 * @access Public
 * @returns {Object} 200 - Health status information
 */

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

/**
 * Health check endpoint
 * Returns server status and basic information
 */
router.get("/", (req, res) => {
  // Check MongoDB connection status
  const mongoStatus =
    mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";

  res.status(200).json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    uptime: process.uptime(),
    mongodb: mongoStatus,
  });
});

module.exports = router;
