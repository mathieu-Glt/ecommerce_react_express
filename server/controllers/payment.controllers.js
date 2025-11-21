/**
 * Payment Controller
 *
 * Gère les paiements via Stripe et PayPal
 * et génère la facture PDF après succès.
 * doc utile:  - https://docs.stripe.com/payments/checkout/how-checkout-works
 *             - https://stripe.com/docs/api/checkout/sessions/create
 *             -  https://docs.stripe.com/api/checkout/sessions/create?lang=node
 *              - https://docs.stripe.com/api/checkout/sessions/retrieve?lang=node
 *             -  https://docs.stripe.com/payments/quickstart-checkout-sessions
 *             -       https://developer.paypal.com/docs/checkout/
 *             -  https://developer.paypal.com/docs/api/orders/v2/
 *              - https://developer.paypal.com/api/rest/integration/orders-api/
 *              - https://developer.paypal.com/api/rest/integration/orders-api/api-use-cases/standard/
 *              - https://github.com/paypal/PayPal-TypeScript-Server-SDK/blob/2.0.0/doc/controllers/orders.md
 *              -  https://github.com/paypal/PayPal-TypeScript-Server-SDK/tree/2.0.0
 *               https://www.npmjs.com/package/@hyperse/paypal-node-sdk
 * https://docs.paypal.ai/reference/api/rest/orders/create-order
 *
 * @module controllers/payment.controller
 *
 */

const path = require("path");
const fetch = require("node-fetch");
const fs = require("fs");
const { asyncHandler } = require("../utils/errorHandler");
const generateInvoice = require("../utils/invoice");
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const paypalClientId = process.env.CLIENT_ID_PAYPAL;
const paypalSecret = process.env.CLIENT_SECRET_PAYPAL;
const PAYPAL_BASE = "https://api-m.sandbox.paypal.com"; // sandbox for test

/* ============================================================
   STRIPE - Creation of the payment session
============================================================ */
exports.createCheckoutSession = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  try {
    const { items } = req.body; // [{ name, price, quantity }]
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: items.map((item) => ({
        price_data: {
          currency: "eur",
          product_data: {
            name: item.name || item.title || "Produit",
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      success_url: `https://cellphone365-api.onrender.com/api/payment/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/paypal/failure`,
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ============================================================
   STRIPE - Invoice generation after success
============================================================ */
exports.stripeSuccess = asyncHandler(async (req, res) => {
  const { session_id } = req.query;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "customer_details"],
    });

    const order = {
      user: {
        name: session.customer_details?.name || "Client Stripe",
        email: session.customer_details?.email || "N/A",
      },
      items: session.line_items.data.map((item) => ({
        product: {
          title: item.description,
          price: item.price.unit_amount / 100,
        },
        quantity: item.quantity,
      })),
      total: session.amount_total / 100,
    };

    const fileName = `invoice-${Date.now()}.pdf`;
    const filePath = path.join(__dirname, "..", "invoices", fileName);
    generateInvoice(order, filePath);

    // Wait for the invoice to be fully written to disk
    await new Promise((resolve, reject) => {
      const check = setInterval(() => {
        if (fs.existsSync(filePath)) {
          clearInterval(check);
          resolve();
        }
      }, 300);
      setTimeout(() => {
        clearInterval(check);
        reject(new Error("Timeout génération facture"));
      }, 5000);
    });

    // ✅ Retourner l'URL du backend, pas du frontend !
    const frontendUrl =
      process.env.FRONTEND_URL ||
      "https://frontend-typescript-react-gules.vercel.app";
    const backendUrl =
      process.env.BACKEND_URL || "https://cellphone365-api.onrender.com";

    // Redirect to the frontend with the invoice URL as a parameter
    res.redirect(
      `${frontendUrl}/merci?invoice=${fileName}&downloadUrl=${backendUrl}/api/invoices/${fileName}`
    );
  } catch (err) {
    res.status(500).send("Error processing payment.");
  }
});

/* ============================================================
   PAYPAL - Creation of the order
============================================================ */
exports.getPaymentWithPaypal = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  try {
    const auth = Buffer.from(`${paypalClientId}:${paypalSecret}`).toString(
      "base64"
    );

    const tokenRes = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenRes.json();

    const orderRes = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "EUR",
              value: amount.toFixed(2),
            },
          },
        ],
        application_context: {
          return_url: `https://cellphone365-api.onrender.com/api/payment/paypal/capture`,
          cancel_url: `${req.headers.origin}/cancel`,
        },
      }),
    });

    const orderData = await orderRes.json();

    res.json({ success: true, id: orderData.id });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Paypal checkout failed",
      error: err.message,
    });
  }
});

/* ============================================================
   PAYPAL - Capture of the payment and invoice generation
============================================================ */
// exports.capturePaypalPayment = asyncHandler(async (req, res) => {
//   const { token } = req.query;
//   console.log("Capturing Paypal payment for token :", token);

//   try {
//     const auth = Buffer.from(`${paypalClientId}:${paypalSecret}`).toString(
//       "base64"
//     );
//     const tokenRes = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
//       method: "POST",
//       headers: {
//         Authorization: `Basic ${auth}`,
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: "grant_type=client_credentials",
//     });

//     const tokenData = await tokenRes.json();

//     const captureRes = await fetch(
//       `${PAYPAL_BASE}/v2/checkout/orders/${token}/capture`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${tokenData.access_token}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const captureData = await captureRes.json();
//     console.log("Paypal payment captured:", captureData);

//     if (captureData.status === "COMPLETED") {
//       const order = {
//         user: {
//           name: `${captureData.payer.name.given_name} ${captureData.payer.name.surname}`,
//           email: captureData.payer.email_address,
//         },
//         items: captureData.purchase_units[0].payments.captures.map((c) => ({
//           product: { title: "Achat PayPal", price: parseFloat(c.amount.value) },
//           quantity: 1,
//         })),
//         total: parseFloat(
//           captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount
//             ?.value || 0
//         ),
//       };

//       // Générer la facture
//       const fileName = `invoice-${Date.now()}.pdf`;
//       const filePath = path.join(__dirname, "..", "invoices", fileName);
//       await generateInvoice(order, filePath);
//       // await new Promise((resolve, reject) => {
//       //   const check = setInterval(() => {
//       //     if (fs.existsSync(filePath)) {
//       //       clearInterval(check);
//       //       resolve();
//       //     }
//       //   }, 300);
//       //   setTimeout(() => {
//       //     clearInterval(check);
//       //     reject(new Error("Timeout génération facture"));
//       //   }, 5000);
//       // });

//       // return res.download(filePath, fileName);
//       // ✅ Redirige vers le front avec l'URL de la facture en paramètre
//       const redirectUrl = `${
//         process.env.FRONTEND_URL || "http://localhost:5173"
//       }/merci-paypal?invoice=${fileName}`;
//       console.log("✅ Redirection vers :", redirectUrl);
//       res.redirect(redirectUrl);
//     }

//     res.status(400).json({ error: "Paiement non complété" });
//   } catch (err) {
//     console.error("Paypal capture error:", err);
//     res.status(500).json({
//       success: false,
//       message: "Paypal capture failed",
//       error: err.message,
//     });
//   }
// });

exports.capturePaypalPayment = async (req, res) => {
  const { token: orderId } = req.query;

  try {
    const auth = Buffer.from(`${paypalClientId}:${paypalSecret}`).toString(
      "base64"
    );

    // Obtain a PayPal access token
    const tokenRes = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    const tokenData = await tokenRes.json();

    // Capture the payment
    const captureRes = await fetch(
      `${PAYPAL_BASE}/v2/checkout/orders/${orderId}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const captureData = await captureRes.json();

    // Verify the status of the capture
    if (captureData.status === "COMPLETED") {
      const payer = captureData.payer || {};
      const name = payer.name
        ? `${payer.name.given_name || ""} ${payer.name.surname || ""}`.trim()
        : "Client PayPal";

      const capture =
        captureData.purchase_units?.[0]?.payments?.captures?.[0] || {};

      const order = {
        user: {
          name,
          email: payer.email_address || "inconnu",
        },
        items: [
          {
            product: {
              title: "Achat via PayPal",
              price: parseFloat(capture.amount?.value || 0),
            },
            quantity: 1,
          },
        ],
        total: parseFloat(capture.amount?.value || 0),
      };

      // Generate the invoice
      const fileName = `invoice-${Date.now()}.pdf`;
      const filePath = path.join(__dirname, "..", "invoices", fileName);
      await generateInvoice(order, filePath);

      // Redirect the client
      const redirectUrl = `${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/merci-paypal?invoice=${fileName}`;

      return res.redirect(redirectUrl);
    }

    // If the payment is not completed
    return res
      .status(400)
      .json({ success: false, error: "Payment not completed" });
  } catch (err) {
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Paypal capture failed",
        error: err.message,
      });
    }
  }
};
