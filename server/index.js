/**
 * Main server entry point.
 * Sets up Express, middlewares, routes, database connection, and starts the server.
 */

require("dotenv").config({ path: __dirname + "/.env" });

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
// 1. COOKIE PARSER - DOIT ÊTRE EN PREMIER
// =============================================
app.use(cookieParser());

// =============================================
// 2. CORS - EN PREMIER (avant les autres middlewares)
// =============================================
const corsOptions = {
  origin: "http://localhost:5173",
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
// ✅ Gérer explicitement les requêtes OPTIONS (preflight)
// app.options("*", cors());

// =============================================
// 3. SECURITY
// =============================================
app.use(helmet());
app.use(hpp());

// =============================================
// 4. RATE LIMITER - Augmenté pour le développement
// =============================================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // ✅ Augmenté temporairement pour debug
  message: "Too many requests, please try again later.",
});
app.use(limiter);

// =============================================
// 5. BODY PARSERS
// =============================================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// =============================================
// 6. SESSION
// =============================================
const sessionConfig = {
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true en production HTTPS
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
    sameSite: "lax", // ✅ CRITIQUE pour CSRF avec cookies
  },
};
const sessionMiddleware = session(sessionConfig);
app.use(sessionMiddleware);

// =============================================
// 7. SOCKET.IO
// =============================================
initSocket(httpServer, sessionMiddleware);

// =============================================
// 8. CSRF PROTECTION
// =============================================
const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    sameSite: "lax", // ✅ CRITIQUE
    secure: false, // false en dev, true en prod
  },
});

// ✅ Route publique pour obtenir le token CSRF (SANS protection CSRF dessus)
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  console.log("🔐 CSRF Token generated:", req.csrfToken());
  console.log("🍪 Cookies in request:", req.cookies);
  res.json({ csrfToken: req.csrfToken() });
});

// ✅ CSRF CONDITIONNEL : Appliquer SEULEMENT sur POST, PUT, DELETE, PATCH
app.use((req, res, next) => {
  // Skip CSRF pour GET et OPTIONS
  if (req.method === "GET" || req.method === "OPTIONS") {
    return next();
  }

  // Skip CSRF pour la route /api/csrf-token
  if (req.path === "/api/csrf-token") {
    return next();
  }

  // Appliquer CSRF pour POST, PUT, DELETE, PATCH
  csrfProtection(req, res, next);
});

// =============================================
// 9. XSS & MONGO SANITIZE
// =============================================
app.use(xssSanitizeMiddleware);
app.use(mongoSanitizeSafe);

// =============================================
// 10. PASSPORT
// =============================================
app.use(passport.initialize());
app.use(passport.session());

// =============================================
// 11. STATIC FILES
// =============================================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/invoices", express.static(path.join(__dirname, "invoices")));

// =============================================
// 12. REQUEST LOGGER
// =============================================
app.use(morgan("dev"));

// Middleware pour logger toutes les URLs
app.use((req, res, next) => {
  console.log(`📌 ${req.method} ${req.url}`);
  next();
});

// ✅ Debug CSRF (AVANT les routes)
app.use((req, res, next) => {
  if (req.method !== "GET") {
    console.log("🔍 CSRF Debug:", {
      method: req.method,
      path: req.path,
      csrfToken: req.csrfToken ? req.csrfToken() : "N/A",
      cookies: req.cookies,
      headerToken: req.headers["x-csrf-token"],
    });
  }
  next();
});

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
const initializeApp = async () => {
  try {
    validateDatabaseConfig();
    await connectDB();

    const PORT = process.env.PORT || 8000;
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(
        `📊 Database type: ${process.env.DATABASE_TYPE || "mongoose"}`
      );
    });
  } catch (error) {
    console.error("❌ Failed to initialize app:", error);
    process.exit(1);
  }
};

initializeApp();
