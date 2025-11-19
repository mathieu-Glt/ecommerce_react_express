/**
 * Middleware to clean user inputs to prevent XSS attacks,
 * using the xss library.
 * Cleans req.body and req.params (except parameters named 'id').
 * Does not touch req.query to avoid issues with read-only parameters.
 */
const xss = require("xss");

function xssSanitizeMiddleware(req, res, next) {
  // Clean body
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    }
  }

  // Clean route params
  if (req.params) {
    for (const key in req.params) {
      // Do not clean parameters named 'id'
      if (key !== "id" && typeof req.params[key] === "string") {
        req.params[key] = xss(req.params[key]);
      }
    }
  }
  // DO NOT touch req.query
  next();
}

module.exports = xssSanitizeMiddleware;
