// // middleware/mongoSanitizeSafe.js - Version corrigée
/**
 * Middleware de sanitization MongoDB personnalisé
 * Remplace express-mongo-sanitize pour éviter les erreurs avec req.query
 */

/**
 * Retire les caractères dangereux MongoDB ($, .)
 * @param {*} value - Valeur à sanitiser
 * @returns {*} Valeur sanitisée
 */
const sanitize = (value) => {
  if (value instanceof Object) {
    for (const key in value) {
      // Supprimer les clés commençant par $
      if (/^\$/.test(key)) {
        delete value[key];
      }
      // Supprimer les clés contenant des points (pour éviter les injections de champs)
      else if (/\./.test(key)) {
        delete value[key];
      }
      // Sanitiser récursivement
      else {
        sanitize(value[key]);
      }
    }
  }
  return value;
};

/**
 * Middleware de sanitization MongoDB
 * Protège contre les injections MongoDB en retirant les opérateurs dangereux
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

    // Sanitize req.query (avec gestion spéciale pour éviter le problème read-only)
    if (req.query && Object.keys(req.query).length > 0) {
      const sanitizedQuery = {};

      for (const key in req.query) {
        // Ne pas inclure les clés dangereuses
        if (!/^\$/.test(key) && !/\./.test(key)) {
          sanitizedQuery[key] = sanitize(req.query[key]);
        }
      }

      // Remplacer req.query en redéfinissant la propriété
      try {
        Object.defineProperty(req, "query", {
          value: sanitizedQuery,
          writable: true,
          enumerable: true,
          configurable: true,
        });
      } catch (defineError) {
        // Si Object.defineProperty échoue, on log l'erreur mais on continue
        console.warn("⚠️  Could not redefine req.query:", defineError.message);
      }
    }

    next();
  } catch (error) {
    console.error("❌ Error in mongoSanitize middleware:", error);
    // En cas d'erreur, on continue quand même pour ne pas bloquer l'application
    next();
  }
};

module.exports = mongoSanitizeSafe;
