/**
 * Main server entry point.
 * Sets up Express, middlewares, routes, database connection, and starts the server.
 * @module server/index.js
 * @requires dotenv
 * @requires express
 * @requires express-session
 * @requires cors
 * @requires morgan
 * @requires helmet
 * @requires express-rate-limit
 * @requires csurf
 * @requires hpp
 * @requires cookie-parser
 * @requires path
 * @requires ./config/passport
 * @requires ./config/socket
 * @requires ./utils/routeLoader
 * @requires ./config/database
 * @requires ./utils/errorHandler
 * @requires ./middleware/mongoSanitizeSafe
 * @requires ./middleware/xssCleanSafe
 * @exports app - The Express application instance
 * @exports httpServer - The HTTP server instance
 *
 * @description
 * This file initializes and configures the Express application,
 * including security middlewares, session management, CSRF protection,
 * database connection, route loading, and error handling.
 */

/**
 * Load environment variables from .env file in development only
 * In production (Render), environment variables are injected directly
 */
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: __dirname + "/.env" });
  console.log("✅ Loaded .env file for development");
} else {
  console.log("✅ Using environment variables from platform (production)");
}
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const csurf = require("csurf");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const path = require("path");
const passport = require("./config/passport");
const { initSocket } = require("./config/socket");
const { loadRoutes } = require("./utils/routeLoader");
const { connectDB, validateDatabaseConfig } = require("./config/database");
const { errorHandler } = require("./utils/errorHandler");
const mongoSanitizeSafe = require("./middleware/mongoSanitizeSafe");
const xssSanitizeMiddleware = require("./middleware/xssCleanSafe");

const app = express();
const httpServer = require("http").createServer(app);

// =============================================
// 1. COOKIE PARSER - MUST BE FIRST
// =============================================
app.use(cookieParser());

// =============================================
// 2. CORS - CONFIGURATION DYNAMIQUE POUR PRODUCTION
// =============================================
/**
 * Configure CORS based on environment
 * Development: Allow localhost
 * Production: Allow only the frontend URL from environment variable
 */
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [process.env.FRONTEND_URL] // Production: only Vercel URL
    : ["http://localhost:5173", "http://localhost:3000"]; // Development: localhost

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl, etc.)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "X-CSRF-Token",
  ],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
// Explicitly handle OPTIONS requests (preflight)
// app.options("*", cors());

// =============================================
// 3. SECURITY
// =============================================
/**
 * helmet() is a security middleware that protects your Express application by automatically setting various HTTP security headers.
 * Equivalent to using multiple helmet middlewares individually, such as :
 * app.use(helmet.contentSecurityPolicy());
 * app.use(helmet.crossOriginEmbedderPolicy());
 * app.use(helmet.crossOriginOpenerPolicy());
 * app.use(helmet.crossOriginResourcePolicy());
 * app.use(helmet.dnsPrefetchControl());
 * app.use(helmet.frameguard());
 * app.use(helmet.hidePoweredBy());
 * app.use(helmet.hsts());
 *  app.use(helmet.ieNoOpen());
 * app.use(helmet.noSniff());
 *  app.use(helmet.originAgentCluster());
 *  app.use(helmet.permittedCrossDomainPolicies());
 *   app.use(helmet.referrerPolicy());
 *   app.use(helmet.xssFilter());
 */
app.use(helmet()); // Secures HTTP headers with Helmet

// =============================================
// 3.1 PREVENT HTTP PARAM POLLUTION
// =============================================
/**
 * hpp() is a middleware that protects against HTTP parameter pollution attacks.
 * These attacks occur when attackers send multiple parameters with the same name in an HTTP request,
 * which can lead to unexpected behavior in the application.
 *
 * For example, a request like /search?item=book&item=pen could be exploited to manipulate application logic.
 * The hpp() middleware ensures that each parameter has only one value, keeping only the first occurrence.
 */
app.use(hpp());

// =============================================
// 4. RATE LIMITER - Increased for development
// =============================================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased temporarily for debugging
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// =============================================
// 5. BODY PARSERS
// =============================================
/**
 * Increasing size limits for JSON and URL-encoded requests
 * Useful for uploads of base64 images or large payloads
 * Adjust according to your needs and monitor memory impact
 */
app.use(express.json({ limit: "10mb" }));
/**
 * extended: true permet de parser des objets complexes imbriqués
 * limit: "10mb" augmente la taille maximale du corps parsé
 * urlencoded est utilisé pour parser les formulaires classiques
 */
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// =============================================
// 6. SESSION - CONFIGURATION DYNAMIQUE
// =============================================
const sessionConfig = {
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production", // true en production (HTTPS)
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // 'none' pour cross-domain en prod
  },
};

if (process.env.NODE_ENV !== "production") {
  console.warn(
    "⚠️  WARNING: Using MemoryStore for sessions (not suitable for production)"
  );
}

const sessionMiddleware = session(sessionConfig);
app.use(sessionMiddleware);
// =============================================
// 7. SOCKET.IO
// =============================================
initSocket(httpServer, sessionMiddleware);

// =============================================
// 8. CSRF PROTECTION - CONFIGURATION DYNAMIQUE
// =============================================
const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
  },
});
// Simple route to get the CSRF token
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  const token = req.csrfToken();
  res.json({ csrfToken: token });
});

// Conditional middleware: CSRF only on POST/PUT/DELETE/PATCH
app.use((req, res, next) => {
  // Skip CSRF for GET, HEAD, OPTIONS
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  // Skip CSRF for the csrf-token route (already protected)
  if (req.path === "/api/csrf-token") {
    return next();
  }

  // Apply CSRF on other routes
  csrfProtection(req, res, next);
});
// Debug CSRF amélioré
// app.use((req, res, next) => {
//   if (req.method !== "GET") {
//     console.log("CSRF Debug:", {
//       method: req.method,
//       path: req.path,
//       csrfCookie: req.cookies._csrf, // Cookie CSRF
//       csrfHeader: req.headers["x-csrf-token"], // Header
//       csrfBody: req.body._csrf, // Cookie CSRF
//       allCookies: req.cookies,
//       allHeaders: req.headers,
//     });
//   }
//   next();
// });

// =============================================
// 9. XSS & MONGO SANITIZE
// =============================================
/**
 * xssSanitizeMiddleware nettoie les entrées utilisateur pour prévenir les attaques XSS
 * mongoSanitizeSafe protège contre les injections NoSQL en supprimant les opérateurs MongoDB des entrées utilisateur
 */
app.use(xssSanitizeMiddleware);
app.use(mongoSanitizeSafe);

// =============================================
// 10. PASSPORT
// =============================================
/**
 * Initialisation de Passport pour l'authentification
 * Utilisation des sessions pour maintenir l'état de l'utilisateur connecté
 */
app.use(passport.initialize());
app.use(passport.session());

// =============================================
// 11. STATIC FILES
// =============================================
/**
 * Servir les fichiers statiques pour les uploads et les factures
 */
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/invoices", express.static(path.join(__dirname, "invoices")));

// =============================================
// 12. REQUEST LOGGER
// =============================================
app.use(morgan("dev"));

// Middleware pour logger toutes les URLs
// app.use((req, res, next) => {
//   console.log(`📌 ${req.method} ${req.url}`);
//   next();
// });

// Debug CSRF (AVANT les routes)
// app.use((req, res, next) => {
//   if (req.method !== "GET") {
//     console.log("CSRF Debug:", {
//       method: req.method,
//       path: req.path,
//       csrfToken: req.csrfToken ? req.csrfToken() : "N/A",
//       cookies: req.cookies,
//       headerToken: req.headers["x-csrf-token"],
//     });
//   }
//   next();
// });

// =============================================
// 13. LOAD ROUTES
// =============================================
loadRoutes(app);

// =============================================
// 14. ERROR HANDLER (DOIT ÊTRE À LA FIN)
// =============================================
app.use(errorHandler);

// =============================================
// 15. START SERVER
// =============================================
console.log("═══════════════════════════════════════");
console.log("🚀 INITIALIZING SERVER...");
console.log("═══════════════════════════════════════");
console.log(`📍 Node version: ${process.version}`);
console.log(`📍 Environment: ${process.env.NODE_ENV || "development"}`);
console.log(`📍 Port: ${process.env.PORT || 8000}`);
console.log(
  `📍 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:5173"}`
);
console.log("═══════════════════════════════════════\n");

const initializeApp = async () => {
  try {
    console.log("🔄 Validating database configuration...");
    validateDatabaseConfig();

    console.log("🔄 Connecting to MongoDB...");
    await connectDB();
    console.log("✅ MongoDB connected successfully\n");

    const PORT = process.env.PORT || 8000;

    // ✅ IMPORTANT: Listen on 0.0.0.0 for Render.com
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log("═══════════════════════════════════════");
      console.log("✅ SERVER STARTED SUCCESSFULLY!");
      console.log("═══════════════════════════════════════");
      console.log(`🌐 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(
        `📡 Frontend URL: ${
          process.env.FRONTEND_URL || "http://localhost:5173"
        }`
      );
      console.log(`🗄️  Database: ${process.env.DATABASE_TYPE || "mongoose"}`);
      console.log("═══════════════════════════════════════");

      if (process.env.NODE_ENV !== "production") {
        console.log(`\n🔗 Local API: http://localhost:${PORT}/api`);
        console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
        console.log(`🔗 CSRF Token: http://localhost:${PORT}/api/csrf-token\n`);
      }
    });
  } catch (error) {
    console.error("═══════════════════════════════════════");
    console.error("❌ SERVER FAILED TO START!");
    console.error("═══════════════════════════════════════");
    console.error("❌ Error:", error.message);
    console.error("❌ Stack:", error.stack);
    console.error("═══════════════════════════════════════\n");
    process.exit(1);
  }
};

initializeApp();

module.exports = { app, httpServer };
