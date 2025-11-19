/**
 * Invoice Controller
 *
 * Handles all product-related operations:
 * - Perform a buy with paypal
 * - Perform a buy with stripe
 *
 * @module controllers/invoice.controller
 */
const { asyncHandler } = require("../utils/errorHandler");
const generateInvoice = require("../utils/invoice");
const path = require("path");

/**
 * Create an invoice PDF
 * @route POST /api/invoice/generate
 * @access Public
 * @returns {File} PDF invoice file for download
 * @returns {Object} 400 - Invalid request data
 * @returns {Object} 500 - Internal server error
 */
exports.generateInvoice = asyncHandler(async (req, res) => {
  const { order } = req.body; // retrieve the payment information
  if (!order) return res.status(400).json({ error: "Order data required" });
  const fileName = `invoice-${Date.now()}.pdf`;
  const filePath = path.join(__dirname, "..", "invoices", fileName);

  generateInvoice(order, filePath);
  res.download(filePath, fileName, (err) => {
    if (err) console.error(err);
  });
});
