/**
 * Monitoring Middleware
 * Tracks performance metrics, security events, and suspicious activities
 * @module middleware/monitoring
 */

const logger = require("./logger");

// Stockage des métriques en mémoire (utiliser Redis en production)
const metrics = {
  requests: new Map(), // Compteur de requêtes par endpoint
  errors: new Map(), // Compteur d'erreurs par type
  slowRequests: [], // Liste des requêtes lentes
  failedLogins: new Map(), // Tentatives de login échouées par IP/email
  blockedIPs: new Set(), // IPs bloquées
};

/**
 * Middleware de monitoring des requêtes HTTP
 */
const monitoringMiddleware = (req, res, next) => {
  const startTime = Date.now();

  // Compter les requêtes par endpoint
  const endpoint = `${req.method} ${req.route?.path || req.path}`;
  metrics.requests.set(endpoint, (metrics.requests.get(endpoint) || 0) + 1);

  // Surveiller la fin de la réponse
  res.on("finish", () => {
    const duration = Date.now() - startTime;

    // Alertes si temps de réponse > 2s
    if (duration > 2000) {
      const slowRequest = {
        method: req.method,
        path: req.path,
        duration: duration,
        timestamp: new Date().toISOString(),
        ip: req.ip,
      };

      metrics.slowRequests.push(slowRequest);

      // Garder seulement les 100 dernières requêtes lentes
      if (metrics.slowRequests.length > 100) {
        metrics.slowRequests.shift();
      }

      logger.warn({
        type: "SLOW_RESPONSE",
        ...slowRequest,
      });
    }

    // Alertes sur erreurs serveur
    if (res.statusCode >= 500) {
      const errorKey = `${res.statusCode}_${req.path}`;
      metrics.errors.set(errorKey, (metrics.errors.get(errorKey) || 0) + 1);

      logger.error({
        type: "SERVER_ERROR",
        statusCode: res.statusCode,
        method: req.method,
        path: req.path,
        ip: req.ip,
        duration: duration,
      });
    }

    // Log de la requête
    logger.logRequest(req, res, duration);
  });

  next();
};

/**
 * Vérifier les tentatives de brute force sur le login
 */
const checkBruteForce = (identifier) => {
  const attempts = metrics.failedLogins.get(identifier) || {
    count: 0,
    firstAttempt: Date.now(),
  };

  const fiveMinutes = 5 * 60 * 1000;

  // Reset si plus de 5 minutes depuis la première tentative
  if (Date.now() - attempts.firstAttempt > fiveMinutes) {
    metrics.failedLogins.delete(identifier);
    return { blocked: false, attempts: 0 };
  }

  // Bloquer si plus de 5 tentatives en 5 minutes
  if (attempts.count >= 5) {
    logger.logSecurity("BRUTE_FORCE_DETECTED", {
      identifier: identifier,
      attempts: attempts.count,
    });

    return { blocked: true, attempts: attempts.count };
  }

  return { blocked: false, attempts: attempts.count };
};

/**
 * Enregistrer une tentative de login échouée
 */
const recordFailedLogin = (identifier, ip) => {
  const attempts = metrics.failedLogins.get(identifier) || {
    count: 0,
    firstAttempt: Date.now(),
  };

  attempts.count += 1;
  metrics.failedLogins.set(identifier, attempts);

  logger.logAuth("FAILED", {
    identifier: identifier,
    ip: ip,
    attempts: attempts.count,
  });

  // Si 10 tentatives échouées, bloquer l'IP temporairement
  if (attempts.count >= 10) {
    blockIP(ip, "Too many failed login attempts");
  }
};

/**
 * Réinitialiser les tentatives de login après succès
 */
const resetFailedLogins = (identifier) => {
  metrics.failedLogins.delete(identifier);
};

/**
 * Bloquer une IP temporairement (1 heure)
 */
const blockIP = (ip, reason) => {
  metrics.blockedIPs.add(ip);

  logger.logSecurity("IP_BLOCKED", {
    ip: ip,
    reason: reason,
  });

  // Débloquer après 1 heure
  setTimeout(() => {
    metrics.blockedIPs.delete(ip);
    logger.info({
      type: "IP_UNBLOCKED",
      ip: ip,
    });
  }, 60 * 60 * 1000);
};

/**
 * Middleware pour bloquer les IPs suspectes
 */
const ipBlockerMiddleware = (req, res, next) => {
  const ip = req.ip;

  if (metrics.blockedIPs.has(ip)) {
    logger.logSecurity("BLOCKED_IP_ATTEMPT", {
      ip: ip,
      path: req.path,
      method: req.method,
    });

    return res.status(403).json({
      error:
        "Access denied. Your IP has been temporarily blocked due to suspicious activity.",
    });
  }

  next();
};

/**
 * Obtenir les métriques actuelles
 */
const getMetrics = () => {
  return {
    totalRequests: Array.from(metrics.requests.values()).reduce(
      (a, b) => a + b,
      0
    ),
    requestsByEndpoint: Object.fromEntries(metrics.requests),
    totalErrors: Array.from(metrics.errors.values()).reduce((a, b) => a + b, 0),
    errorsByType: Object.fromEntries(metrics.errors),
    slowRequests: metrics.slowRequests.slice(-20), // 20 dernières requêtes lentes
    failedLoginsCount: metrics.failedLogins.size,
    blockedIPsCount: metrics.blockedIPs.size,
  };
};

/**
 * Route pour exposer les métriques (à protéger avec auth admin)
 */
const metricsRoute = (req, res) => {
  res.json(getMetrics());
};

module.exports = {
  monitoringMiddleware,
  checkBruteForce,
  recordFailedLogin,
  resetFailedLogins,
  blockIP,
  ipBlockerMiddleware,
  metricsRoute,
  getMetrics,
};
