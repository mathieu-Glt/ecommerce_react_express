const express = require("express");
const {
  getPaymentWithPaypal,
  createCheckoutSession,
  capturePaypalPayment,
  stripeSuccess,
} = require("../controllers/payment.controllers");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

/**
 * Payment Routes
 *
 * Handles payment users management.
 * Includes Stripe and Paypal payment routes.,
 *
 * @module routes/authRoutes
 */

/**
 * @route POST /payment/paypal
 * @desc Process a payment using Paypal
 * @access Public
 */

// POST /api/payment/paypal
router.post("/paypal", authenticateToken, getPaymentWithPaypal);
router.get("/paypal/capture", capturePaypalPayment);

router.post(
  "/stripe/create-checkout-session",
  authenticateToken,
  createCheckoutSession
);
router.get("/stripe/success", stripeSuccess);

module.exports = router;
