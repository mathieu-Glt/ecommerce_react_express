// Dans server/routes/invoiceRoutes.js (ou stripeRoutes.js)

const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

/**
 * @route GET /invoices/:filename
 * @desc Download invoice PDF
 * @access Public
 */
router.get("/:filename", (req, res) => {
  const { filename } = req.params;

  // Sécurité : Vérifier que c'est bien un fichier PDF
  if (!filename.endsWith(".pdf")) {
    return res.status(400).json({ error: "Invalid file format" });
  }
  // Construire le chemin complet du fichier à partir du nom de fichier __dirname : répertoire courant là ou on  se trouve dans l'arborescence
  const filePath = path.join(__dirname, "..", "invoices", filename);

  // Vérifier que le fichier existe
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Invoice not found" });
  }

  // Envoyer le fichier
  res.download(filePath, filename, (err) => {
    if (err) {
      console.error("Error downloading invoice:", err);
      res.status(500).json({ error: "Failed to download invoice" });
    }
  });
});

module.exports = router;
