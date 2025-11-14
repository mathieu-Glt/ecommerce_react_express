const xss = require("xss");

function xssSanitizeMiddleware(req, res, next) {
  // Nettoyage du body
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    }
  }

  // Nettoyage des params de route
  if (req.params) {
    for (const key in req.params) {
      // Ne pas nettoyer les paramètres nommés 'id'
      if (key !== "id" && typeof req.params[key] === "string") {
        req.params[key] = xss(req.params[key]);
      }
    }
  }
  // NE PAS toucher à req.query
  next();
}

module.exports = xssSanitizeMiddleware;
