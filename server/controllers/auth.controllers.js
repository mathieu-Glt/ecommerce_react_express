/**
 * Auth Controller
 *
 * Handles all authentication-related logic:
 * - User login and registration
 * - OAuth callbacks (Google and Azure AD)
 * - JWT token generation and verification
 * - Password reset (not fully implemented here)
 * - Current user retrieval from session or JWT
 *
 * @module controllers/auth.controllers
 */

const { asyncHandler } = require("../utils/errorHandler");
const AuthServiceFactory = require("../factories/authServiceFactory");
const { fs } = require("fs");
const { saveBase64Image, validateBase64Image } = require("../utils/imageUtils");
const jwt = require("jsonwebtoken");
const { getIO, emitToSession } = require("../config/socket");
require("dotenv").config();

// Create auth service based on database type (mongoose or mysql)
const authService = AuthServiceFactory.createAuthService(
  process.env.DATABASE_TYPE || "mongoose"
);

/**
 * Get the currently authenticated user
 *
 * @route GET /user
 * @param {Object} req - Express request object (contains user from middleware).
 * @param {Object} res - Express response object.
 * @returns {JSON} 200 - Success message or error.
 * @returns {JSON} 400 - Error message if update fails.
 * @returns {JSON} 500 - Server error.
 *
 */
exports.getCurrentUser = (req, res) => {
  try {
    // Récupérer l'utilisateur depuis Passport ou la session
    const user = req.user || req.session?.user;

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Utilisateur non trouvé",
      });
    }

    // Ne renvoyer que les champs nécessaires côté frontend
    const safeUser = {
      _id: user._id,
      googleId: user.googleId,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      picture: user.picture,
      role: user.role,
      cart: user.cart,
      address: user.address,
      isActive: user.isActive,
    };

    // Injecte dans la session pour Socket.IO
    req.session.user = user;
    req.session.token = req.token;
    req.session.refreshToken = req.refreshToken;
    req.session.save();

    return res.status(200).json({
      status: "success",
      user: safeUser,
    });
  } catch (err) {
    console.error("Erreur getCurrentUser :", err);
    return res.status(500).json({
      status: "error",
      message: "Une erreur est survenue",
    });
  }
};

/**
 * Handle OAuth callback (Google or Azure)
 * @access Public
 * @param {Object} req.user - User object returned from OAuth provider
 * @returns {Redirect} Redirects to frontend with token and refreshToken
 * @returns {Redirect} Redirects to login page if auth fails
 */
exports.handleOAuthCallback = async (req, res) => {
  if (!req.user) {
    return res.redirect(`${process.env.FRONTEND_URL}/login`);
  }

  try {
    const token = authService.generateToken(req.user);
    const refreshToken = authService.generateRefreshToken(req.user);

    // Store the access token, refresh token, and user info in the session.
    // Wrap `req.session.save` in a Promise and `await` it to ensure the session
    // has been persisted before continuing.
    // This allows catching any errors during session saving with try/catch,
    // so the next steps won't run if the session wasn't saved successfully.

    /**
     * req.session is an object provided by express-session.
      Here, three pieces of information are stored in the session:
      refreshToken → used to generate a new JWT when the current one expires.
      token → the current JWT or access token.
      user → the logged-in user’s information (req.user usually comes from Passport after OAuth login).
     */

    req.session.refreshToken = refreshToken;
    req.session.token = token;
    req.session.user = req.user;

    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    emitToSession(req.session.id, "user:connected", {
      user: req.user,
      token,
      refreshToken,
    });

    // Construct a URL pointing to the frontend application and append query parameters
    // containing the access token, refresh token, and an authentication success flag.
    // Then, redirect the user’s browser to this URL.
    // Example result: http://frontend-url.com?token=abc123&refreshToken=def456&auth=success
    const redirectUrl = new URL(process.env.FRONTEND_URL);
    redirectUrl.searchParams.set("token", token);
    redirectUrl.searchParams.set("refreshToken", refreshToken);
    redirectUrl.searchParams.set("auth", "success");

    res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("Erreur handleOAuthCallback :", error);
    res.redirect(`${FRONTEND_URL}/login?error=callback_error`);
  }
};

/**
 * Get user profile from session or JWT
 * @access Protected
 * @returns {Object} 200 - Returns user info
 * @returns {Object} 404 - User not found
 */
exports.getUserProfile = asyncHandler(async (req, res) => {
  if (req.user) {
    return res.json({
      success: true,
      user: req.user,
    });
  }
  res.json({
    success: false,
    error: "User not found",
  });
});

/**
 * User login with email and password
 * @access Public
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} 200 - Success, user info, JWT token
 * @returns {Object} 400 - Missing email or password
 * @returns {Object} 401 - Invalid credentials
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("Données reçues pour la connexion:", {
    email,
    hasPassword: !!password,
  });

  // Check email and pass
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password required",
    });
  }

  // Authenticate the user
  const result = await authService.authenticateUser(email, password);
  console.log("result", result.user);

  if (!result.success) {
    return res.status(401).json({
      success: false,
      error: result.error,
    });
  }

  // Emit the Socket.IO event after saving
  // const io = getIO();
  // io.to(req.session.id).emit("user:connected", {
  //   user: req.user,
  //   token: token,
  //   refreshToken: refreshToken,
  // });

  // Return the user data and the token
  res.status(200).json({
    success: true,
    message: "Connection successful",
    user: result.user,
    token: result.token,
    refreshToken: result.refreshToken,
  });
});

/**
 * User registration
 * @access Public
 * @param {string} email
 * @param {string} password
 * @param {string} firstname
 * @param {string} lastname
 * @param {string} picture - Base64 image
 * @param {string} [address] - Optional user address
 * @returns {Object} 201 - User created successfully, JWT token
 * @returns {Object} 400 - Validation errors
 */
exports.register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname, address } = req.body;

  console.log("📝 Données reçues pour l'inscription:", {
    email,
    firstname,
    lastname,
    hasPassword: !!password,
    hasPicture: !!req.file,
    file: req.file,
    address: address || "Non communiqué",
  });

  // Validation des champs REQUIS (picture est optionnel)
  if (!email || !password || !firstname || !lastname) {
    // Supprimer le fichier uploadé si validation échoue
    if (req.file) {
      fs.unlinkSync(req.file.path); // Version synchrone plus simple
    }

    return res.status(400).json({
      success: false,
      error: "Email, password, firstname et lastname sont requis",
    });
  }
  // Vérifier si l'utilisateur n'existe pas déja
  const existingUser = await authService.userExists(email);
  if (existingUser.success && existingUser.user) {
    return res.status(400).json({
      success: false,
      error: "Email already exists",
    });
  }

  // Validation de la longueur du mot de passe
  if (password.length < 8) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(400).json({
      success: false,
      error: "Le mot de passe doit contenir au moins 8 caractères",
    });
  }

  // Construire le chemin de l'image pour la BDD
  let picturePath = null;
  if (req.file) {
    // Chemin relatif pour stockage en BDD
    picturePath = `/uploads/avatars/${req.file.filename}`;
    console.log("✅ Image enregistrée:", picturePath);
  } else {
    console.log("ℹ️ Aucune image uploadée (optionnel)");
  }

  try {
    // Créer l'utilisateur dans la base de données
    const result = await authService.createUser({
      email,
      password,
      firstname,
      lastname,
      address: address || "",
      role: "user",
      picture: picturePath, // null si pas d'image
    });

    if (!result.success) {
      // Supprimer le fichier si la création échoue
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        success: false,
        error: result.error,
      });
    }

    // ✅ Succès - Retourner les données utilisateur
    res.status(201).json({
      success: true,
      message: "Utilisateur créé avec succès",
      user: result.user,
    });
  } catch (error) {
    // Supprimer le fichier en cas d'erreur
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    throw error; // Laisse asyncHandler gérer l'erreur
  }
});
/**
 * Verify JWT token validity
 * @access Protected
 * @param {string} Authorization header
 * @returns {Object} 200 - Token valid, user info
 * @returns {Object} 401 - Token missing or invalid
 * @returns {Object} 404 - User not found
 */
exports.verifyToken = asyncHandler(async (req, res) => {
  const authHeader = req.headers["authorization"];
  // Retrieve value token after "Bearer "
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Token required",
    });
  }

  const result = authService.verifyToken(token);

  if (!result.success) {
    return res.status(401).json({
      success: false,
      error: result.error,
    });
  }

  // Retrieve user info from DB using userId from token payload
  // to ensure the user still exists and get latest info
  // (in case user was deleted or updated since token was issued)
  const userResult = await authService.getUserById(result.user.userId);

  if (!userResult.success) {
    return res.status(404).json({
      success: false,
      error: "User not found",
    });
  }

  res.json({
    success: true,
    message: "Token valid",
    user: userResult.user,
  });
});

/**
 * Logout user by destroying session
 * @access Protected
 * @returns {Object} 200 - Logout successful
 * @returns {Object} 500 - Error destroying session
 */
exports.logout = asyncHandler(async (req, res) => {
  const sessionId = req.session?.id;

  req.session.destroy((err) => {
    if (err) {
      console.error("Erreur lors de la destruction de session :", err);
      return res
        .status(500)
        .json({ success: false, message: "Erreur de logout" });
    }

    res.clearCookie("connect.sid"); // Clear session cookie

    // Émet l'événement Socket.IO
    // const io = getIO();
    // io.to(sessionId).emit("user:logout");

    res.json({ success: true, message: "Logout successful" });
  });
});
