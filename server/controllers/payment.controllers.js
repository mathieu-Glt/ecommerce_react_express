/**
 * Payment Controller
 *
 * Gère les paiements via Stripe et PayPal
 * et génère la facture PDF après succès.
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
const PAYPAL_BASE = "https://api-m.sandbox.paypal.com"; // sandbox pour tests

/* ============================================================
   ✅ STRIPE - Création de la session de paiement
============================================================ */
exports.createCheckoutSession = asyncHandler(async (req, res) => {
  try {
    const { items } = req.body; // [{ name, price, quantity }]
    console.log("Creating Stripe checkout session for items:", items);

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
      success_url: `http://localhost:8000/api/payment/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/paypal/failure`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe session error:", error);
    res.status(500).json({ error: error.message });
  }
});

/* ============================================================
   ✅ STRIPE - Génération facture après succès
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

    // Attente que la facture soit bien écrite sur le disque
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

    // ✅ Redirige vers le front avec l'URL de la facture en paramètre
    const redirectUrl = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/merci?invoice=${fileName}`;
    console.log("✅ Redirection vers :", redirectUrl);
    res.redirect(redirectUrl);
  } catch (err) {
    console.error("Erreur génération facture Stripe:", err);
    res.status(500).send("Erreur lors du traitement du paiement.");
  }
});

/* ============================================================
   🟢 PAYPAL - Création de la commande
============================================================ */
exports.getPaymentWithPaypal = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  console.log("Initiating Paypal payment for amount:", amount);

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
    console.log("Paypal access token obtained:", tokenData);

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
          return_url: `http://localhost:8000/api/payment/paypal/capture`,
          cancel_url: `${req.headers.origin}/cancel`,
        },
      }),
    });

    const orderData = await orderRes.json();
    console.log("Paypal order created:", orderData);

    res.json({ success: true, id: orderData.id });
  } catch (err) {
    console.error("Paypal checkout error:", err);
    res.status(500).json({
      success: false,
      message: "Paypal checkout failed",
      error: err.message,
    });
  }
});

/* ============================================================
   🟢 PAYPAL - Capture du paiement et génération de facture
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
  console.log("📌 Capture PayPal pour l’ordre :", orderId);

  try {
    const auth = Buffer.from(`${paypalClientId}:${paypalSecret}`).toString(
      "base64"
    );

    // 🔹 1. Obtenir un token d’accès PayPal
    const tokenRes = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    const tokenData = await tokenRes.json();

    // 🔹 2. Capturer le paiement
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
    console.log("💰 Capture PayPal :", captureData);

    // 🔹 3. Vérifier le statut
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

      // 🔹 4. Générer la facture
      const fileName = `invoice-${Date.now()}.pdf`;
      const filePath = path.join(__dirname, "..", "invoices", fileName);
      await generateInvoice(order, filePath);

      console.log("✅ Facture générée :", filePath);

      // 🔹 5. Rediriger le client
      const redirectUrl = `${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/merci-paypal?invoice=${fileName}`;

      console.log("🚀 Redirection vers :", redirectUrl);
      return res.redirect(redirectUrl);
    }

    // Si le paiement n'est pas complété
    return res
      .status(400)
      .json({ success: false, error: "Paiement non complété" });
  } catch (err) {
    console.error("Paypal capture error:", err);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "Paypal capture failed",
        error: err.message,
      });
    }
  }
};
