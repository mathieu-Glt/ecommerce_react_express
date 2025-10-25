/**
 * @file AuthService.js
 * @description
 * Authentication Service
 *
 * Handles authentication, JWT generation and verification,
 * user creation, password validation, and user retrieval.
 * Uses an abstracted user repository for database operations.
 *
 * Dependencies:
 *  - jsonwebtoken
 *  - bcryptjs
 *  - Brevo transactional email service (sendWelcomeEmail)
 *
 * Environment Variables:
 *  - JWT_SECRET: Secret key for signing JWT tokens
 *  - JWT_EXPIRES_IN: Expiration time for JWT tokens (default: "24h")
 */

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sendWelcomeEmail } = require("../config/brevo");

/**
 * Authentication Service
 * @class AuthService
 */
class AuthService {
  /**
   * Initializes AuthService with a user repository.
   * @param {Object} userRepository - Repository abstraction for user operations.
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
    this.jwtSecret = process.env.JWT_SECRET || "panzerfaust";
    this.jwtSecretRefresh = process.env.REFRESH_TOKEN_SECRET || "k2rfaust";
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || "24h";
    this.jwtExpiresRefreshTokenIn =
      process.env.JWT_EXPIRES_REFRESHTOKEN_IN || "7d";
  }
  /**
   * @typedef {Object} AuthResult
   * @property {boolean} success - Whether authentication succeeded
   * @property {Object} [user] - User data (if success, without password)
   * @property {string} [token] - JWT token (if success)
   * @property {string} [error] - Error message (if failure)
   */

  /**
   * Check if a user exists by email.
   * @param {string} email - User email.
   * @returns {Promise<Object>} Result object containing:
   *  - success {boolean} Whether user was found
   *  - user {Object} User data (if found, without password)
   */
  async userExists(email) {
    try {
      const userResult = await this.userRepository.getUserByEmail(email);
      if (!userResult.success || !userResult.user) {
        return { success: false };
      }
      const user = userResult.user;
      const userData = {
        _id: user._id,
        email: user.email,
        name:
          user.name || `${user.firstname || ""} ${user.lastname || ""}`.trim(),
        firstname: user.firstname,
        lastname: user.lastname,
        picture: user.picture,
        address: user.address || "",
        role: user.role || "user",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: "Error checking user existence" };
    }
  }

  /**
   * refreshToken
   * @param {string} refreshToken - JWT refresh token.
   * @returns {Promise<Object>} Result object containing:
   *  - success {boolean} Whether refresh succeeded
   *  - token {string} New JWT token (if success)
   *  - refreshToken {string} New JWT refresh token (if success)
   *  - error {string} Error message (if failure)
   */
  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, this.jwtSecretRefresh);
      console.log("Decoded refresh token:", decoded);
      const userId = decoded.userId;
      console.log("User ID from refresh token:", userId);

      const userResult = await this.userRepository.findUserById(userId);
      console.log("User result from repository:", userResult);
      if (!userResult.success || !userResult.user) {
        return { success: false, error: "User not found" };
      }

      const user = userResult.user;
      console.log("User found:", user);

      const newToken = this.generateToken(user);
      const newRefreshToken = this.generateRefreshToken(user);

      return {
        success: true,
        token: newToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      return { success: false, error: "Invalid or expired refresh token" };
    }
  }

  /**
   * Authenticate a user using email and password.
   * @param {string} email - User email.
   * @param {string} password - Plain text password.
   * @returns {Promise<Object>} Result object containing:
   *  - success {boolean} Whether authentication succeeded
   *  - user {Object} User data (if success, without password)
   *  - token {string} JWT token (if success)
   *  - error {string} Error message (if failure)
   */
  async authenticateUser(email, password) {
    try {
      const userResult = await this.userRepository.getUserByEmail(email);

      // Vérifier si l'utilisateur existe
      if (!userResult.success || !userResult.user) {
        return { success: false, error: "Email or password incorrect" };
      }

      const user = userResult.user;

      // Vérifier si l'utilisateur a un mot de passe (cas OAuth)
      // Message générique pour ne pas révéler que le compte existe
      if (!user.password) {
        return { success: false, error: "Email or password incorrect" };
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return { success: false, error: "Email or password incorrect" };
      }

      // Générer les tokens
      const token = this.generateToken(user);
      const refreshToken = this.generateRefreshToken(user);

      const userData = {
        _id: user._id,
        email: user.email,
        name:
          user.name || `${user.firstname || ""} ${user.lastname || ""}`.trim(),
        firstname: user.firstname,
        lastname: user.lastname,
        token,
        refreshToken,
        picture: user.picture,
        address: user.address || "",
        role: user.role || "user",
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return { success: true, user: userData, token, refreshToken };
    } catch (error) {
      console.error("Authentication error:", error);
      return { success: false, error: "Authentication error" };
    }
  }
  /**
   * Generate a JWT token for a user.
   * @param {Object} user - User object.
   * @returns {string} Signed JWT containing userId, email, and role.
   */
  // static generateToken(user) {
  //   const payload = {
  //     userId: user._id,
  //     email: user.email,
  //     role: user.role || "user",
  //   };
  //   return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn });
  // }
  generateToken(user) {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role || "user",
    };
    return jwt.sign(payload, this.jwtSecret, { expiresIn: this.jwtExpiresIn });
  }
  /**
 * Genrate a JWT refreshToken a user
 * @param {Object} user - User object.
   @returns {string} Signed JWT containing userId, email, and role.
 */
  generateRefreshToken(user) {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role || "user",
    };
    return jwt.sign(payload, this.jwtSecretRefresh, {
      expiresIn: this.jwtExpiresRefreshTokenIn,
    });
  }

  /**
   * Verify a JWT token.
   * @param {string} token - JWT token to verify.
   * @returns {Object} Result containing:
   *  - success {boolean} Whether token is valid
   *  - user {Object} Decoded payload (if valid)
   *  - error {string} Error message (if invalid/expired)
   */
  verifyToken(token) {
    console.log("Secret used for sign:", this.jwtSecret);
    console.log("Secret used for verify:", process.env.JWT_SECRET);
    console.log("Equal?", this.jwtSecret === process.env.JWT_SECRET);

    try {
      const cleanToken = token.replace(/^"|"$/g, "").trim();
      const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);
      return { success: true, user: decoded };
    } catch (error) {
      console.error("JWT verification error:", error.message);
      return { success: false, error: "Invalid or expired token" };
    }
  }
  /**
   * Create a new user or update existing one if email already exists.
   * Automatically hashes password if needed and sends a welcome email.
   * @param {Object} userData - User data including email, password, firstname, lastname, picture, address, role.
   * @returns {Promise<Object>} Result containing:
   *  - success {boolean}
   *  - user {Object} Created/updated user data (without password)
   *  - token {string} JWT token for the new user
   *  - error {string} Error message (if failure)
   */
  async createUser(userData) {
    try {
      const result = await this.userRepository.findOrCreateUser(userData);

      if (!result.success) return result;

      try {
        await sendWelcomeEmail(result.user.email, result.user.firstname);
      } catch (error) {
        console.error("Error sending welcome email:", error);
      }

      const userResponse = {
        _id: result.user._id,
        email: result.user.email,
        name:
          result.user.name ||
          `${result.user.firstname || ""} ${result.user.lastname || ""}`.trim(),
        firstname: result.user.firstname,
        lastname: result.user.lastname,
        picture: result.user.picture,
        address: result.user.address || "",
        role: result.user.role || "user",
        createdAt: result.user.createdAt,
        updatedAt: result.user.updatedAt,
      };

      return { success: true, user: userResponse };
    } catch (error) {
      return { success: false, error: "User creation error" };
    }
  }

  /**
   * Retrieve a user by their ID.
   * @param {string} userId - User ID.
   * @returns {Promise<Object>} Result containing:
   *  - success {boolean}
   *  - user {Object} User data without password
   *  - error {string} Error message (if failure)
   */
  async getUserById(userId) {
    try {
      const result = await this.userRepository.findUserById(userId);

      if (!result.success || !result.user) return result;

      const userResponse = {
        _id: result.user._id,
        email: result.user.email,
        name:
          result.user.name ||
          `${result.user.firstname || ""} ${result.user.lastname || ""}`.trim(),
        firstname: result.user.firstname,
        lastname: result.user.lastname,
        picture: result.user.picture,
        address: result.user.address || "",
        role: result.user.role || "user",
        createdAt: result.user.createdAt,
        updatedAt: result.user.updatedAt,
      };

      return { success: true, user: userResponse };
    } catch (error) {
      return { success: false, error: "User retrieval error" };
    }
  }

  /**
   * Get the role of a user by their ID.
   * @param {string} userId - User ID.
   * @returns {Promise<Object>} Result containing:
   *  - success {boolean}
   *  - role {string} User role (default "user")
   *  - error {string} Error message (if failure)
   */
  async getUserRole(userId) {
    try {
      const result = await this.userRepository.findUserById(userId);
      if (!result.success || !result.user)
        return { success: false, error: "User not found" };
      return { success: true, role: result.user.role || "user" };
    } catch (error) {
      return { success: false, error: "Error retrieving user role" };
    }
  }

  /**
   * Get the role of a user by their email.
   * @param {string} email - User ID.
   * @returns {Promise<Object>} Result containing:
   *  - success {boolean}
   *  - error {string} Error message (if failure)
   */
  async getUserRoleByEmail(email) {
    try {
      const result = await this.userRepository.getUserByEmail(email);
      if (!result.success || !result.user)
        return { success: false, error: "User not found" };
      return { success: true, role: result.user.role || "user" };
    } catch (error) {
      return { success: false, error: "Error retrieving user role" };
    }
  }
}

module.exports = AuthService;
