// middleware/mongoSanitizeSafe.js - Fixed version
/**
 * Custom MongoDB sanitization middleware
 * Replaces express-mongo-sanitize to avoid errors with req.query
 */

/**
 * Removes dangerous MongoDB characters ($, .)
 * @param {*} value - Value to sanitize
 * @returns {*} Sanitized value
 */
const sanitize = (value) => {
  // If it's not an object or array, return the value as is
  if (typeof value !== "object" || value === null) {
    return value;
  }
  // If it's an object, sanitize each element
  if (value instanceof Object) {
    // Loop through object keys
    for (const key in value) {
      // Remove keys starting with $
      if (/^\$/.test(key)) {
        delete value[key];
      }
      // Remove keys containing dots (to prevent field injection)
      else if (/\./.test(key)) {
        delete value[key];
      }
      // Recursively sanitize
      else {
        sanitize(value[key]);
      }
    }
  }
  return value;
};

/**
 * MongoDB sanitization middleware
 * Protects against MongoDB injections by removing dangerous operators
 */
const mongoSanitizeSafe = (req, res, next) => {
  try {
    // Sanitize req.body
    if (req.body && Object.keys(req.body).length > 0) {
      req.body = sanitize(req.body);
    }

    // Sanitize req.params
    if (req.params && Object.keys(req.params).length > 0) {
      req.params = sanitize(req.params);
    }

    // Sanitize req.query (with special handling to avoid read-only issue)
    if (req.query && Object.keys(req.query).length > 0) {
      const sanitizedQuery = {};

      for (const key in req.query) {
        // Don't include dangerous keys
        if (!/^\$/.test(key) && !/\./.test(key)) {
          sanitizedQuery[key] = sanitize(req.query[key]);
        }
      }

      // Replace req.query by redefining the property
      try {
        Object.defineProperty(req, "query", {
          value: sanitizedQuery,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      } catch (defineError) {
        // Log only in development
        if (process.env.NODE_ENV === "development") {
          console.warn(
            "⚠️  Could not redefine req.query:",
            defineError.message
          );
        }
        return next(defineError);
      }
    }

    next();
  } catch (error) {
    console.error("❌ Error in mongoSanitize middleware:", error);
    // In case of error, continue anyway to not block the application
    return next(error);
  }
};

module.exports = mongoSanitizeSafe;
