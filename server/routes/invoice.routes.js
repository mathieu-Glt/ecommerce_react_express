const express = require("express");
const router = express.Router();

/**
 * Invoice Routes
 *
 * Handles invoice management.
 * Includes routes for creating and retrieving invoices.
 *
 * @module routes/invoiceRoutes
 */

/**
 * @route POST /invoice/create
 * @desc Create an invoice PDF
 * @access Public
 */
router.post("/generate", (req, res) => {
  const { order } = req.body; // retrieve the payment information
  if (!order) return res.status(400).json({ error: "Order data required" });

  const fileName = `invoice-${Date.now()}.pdf`;
  const filePath = path.join(__dirname, "..", "invoices", fileName);

  generateInvoice(order, filePath);

  res.download(filePath, fileName, (err) => {
    if (err) console.error(err);
  });
});

module.exports = router;
