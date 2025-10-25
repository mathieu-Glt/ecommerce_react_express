/**
 * @file auth.middleware.js
 * @description
 * This module provides authentication and authorization middleware for an Express app.
 * It supports JWT authentication, session-based authentication, role-based access control,
 * and optional Firebase token verification.
 *
 * Dependencies:
 *  - AuthService: custom service for JWT verification
 *  - UserServiceFactory: factory to create user service based on database type
 *  - firebase-admin: for Firebase token verification
 */

// Create instances of services
const AuthService = require("../services/authService");
const UserServiceFactory = require("../factories/userServiceFactory");
const admin = require("firebase-admin");

const userService = UserServiceFactory.createUserService(
  process.env.DATABASE_TYPE || "mongoose"
);
const authService = new AuthService(userService.userRepository);

/**
 * Extract the token from the Authorization header.
 * Returns null if no Bearer token is present.
 */
const extractToken = (req) => {
  const authHeader = req.headers["authorization"];
  console.log("Authorization Header:", authHeader);
  return authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
};

/**
 * Middleware to authenticate users using JWT or session.
 * Priority is given to JWT if present.
 * Steps:
 * Extract token from Authorization header.
 * If no token and no session user → return 401 Unauthorized.
 * If JWT is present → verify it using AuthService:
 *    - If invalid → return 403 Forbidden.
 *    - If valid → attach user payload to req.user.
 * If session user exists and no JWT → attach session user to req.user.
 * Call next() to continue to the next middleware/route.
 */
const authenticateToken = async (req, res, next) => {
  console.log("authenticateToken", req.headers);
  console.log("Session data:", req.session);
  try {
    // Extract token from Authorization header
    const token = extractToken(req);
    console.log("Extracted Token:", token);

    if (!token && !req.session?.user) {
      return res.status(401).json({ success: false, error: "Token required" });
    }

    let user;
    if (token) {
      // Verify JWT token and decoded payload
      const tokenResult = authService.verifyToken(token);
      console.log("Token verification result:", tokenResult);
      if (!tokenResult.success) {
        return res
          .status(403)
          .json({ success: false, error: tokenResult.error });
      }
      user = tokenResult.user;
      // If there is not token but session user exists
    } else if (req.session.user) {
      user = req.session.user;
    }
    // Pass user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Error authenticateToken:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

/**
 * Optional authentication middleware.
 * Does not block access if the user is not authenticated.
 * If JWT or session user exists, attaches it to req.user.
 */
// const optionalAuth = async (req, res, next) => {
//   try {
//     const token = extractToken(req);
//     if (token) {
//       const tokenResult = authService.verifyToken(token);
//       if (tokenResult.success) req.user = tokenResult.user;
//     } else if (req.session?.user) {
//       req.user = req.session.user;
//     }
//     next();
//   } catch (error) {
//     console.error("Error optionalAuth:", error);
//     next();
//   }
// };

/**
 * Middleware to enforce role-based access control.
 * @param {Array<string>} roles - Array of allowed roles (e.g., ["admin", "moderator"])
 * Steps:
 * Ensure req.user exists → if not, return 401 Unauthorized.
 * Check if req.user.role is included in allowed roles → if not, return 403 Forbidden.
 * Call next() if the user has a valid role.
 */
const requireRole = (roles) => (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, error: "Authentication required" });
  }
  const userRole = req.user.role || "user";
  if (!roles.includes(userRole)) {
    return res
      .status(403)
      .json({ success: false, error: "Insufficient permissions" });
  }
  next();
};

/**
 * Middleware to authenticate users using Firebase tokens.
 * Steps:
 * Extract Bearer token from Authorization header.
 * If token is missing → return 401 Unauthorized.
 * Verify the token with Firebase Admin SDK.
 * Retrieve the user document from Firestore based on Firebase UID.
 * Attach the user data to req.user and call next().
 * If verification fails → return 401 with "Invalid or Expired Token".
 */
const checkAuthFirebase = async (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token)
      return res.status(401).json({ status: "error", message: "Unauthorized" });

    const firebaseUser = await admin.auth().verifyIdToken(token);
    const userDoc = await admin
      .firestore()
      .collection("users")
      .doc(firebaseUser.uid)
      .get();

    req.user = userDoc.data();
    next();
  } catch (error) {
    console.error("Error checkAuthFirebase:", error);
    res
      .status(401)
      .json({ status: "error", message: "Invalid or Expired Token" });
  }
};

module.exports = {
  authenticateToken,
  // optionalAuth,
  requireRole,
  checkAuthFirebase,
};
