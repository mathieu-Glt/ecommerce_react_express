/**
 * Module for generating PDF invoices for orders.
 * Uses the PDFKit library to create PDF documents.
 *
 * @module utils/invoice
 * docutile : génération de factures PDF - https://www.npmjs.com/package/pdfkit?activeTab=readme
 */
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
// Stripe invoice generation
function generateInvoice(order, filePath) {
  // Ensure the "invoices" folder exists
  const invoicesDir = path.dirname(filePath);
  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
  }

  const doc = new PDFDocument({ margin: 50 });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // Logo at the top
  const logoPath = path.join(__dirname, "..", "assets", "logo.png");
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 20, { width: 100 });
  }

  doc.moveDown(4);

  // Invoice Title
  doc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("FACTURE D'ACHAT", { align: "center" });
  doc.moveDown(0.5);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(); // ligne horizontale
  doc.moveDown(1);

  // Customer Information
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Informations client :", { underline: true });
  doc.moveDown(0.2);
  doc
    .font("Helvetica")
    .text(`Nom : ${order.user.name}`)
    .text(`Email : ${order.user.email}`)
    .text(`Date : ${new Date().toLocaleDateString("fr-FR")}`);
  doc.moveDown(1);

  // Purchased Items Table
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Articles achetés :", { underline: true });
  doc.moveDown(0.5);

  // Table Header
  doc.font("Helvetica-Bold");
  doc.text("Product", 50, doc.y, { width: 220 });
  doc.text("Quantity", 270, doc.y, { width: 80, align: "right" });
  doc.text("Unit Price", 350, doc.y, { width: 100, align: "right" });
  doc.text("Total", 450, doc.y, { width: 100, align: "right" });
  doc.moveDown(0.5);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.2);

  // Items
  doc.font("Helvetica");
  order.items.forEach((item) => {
    const totalItem = item.product.price * item.quantity;
    doc.text(item.product.title, 50, doc.y, { width: 220 });
    doc.text(item.quantity.toString(), 270, doc.y, {
      width: 80,
      align: "right",
    });
    doc.text(item.product.price.toFixed(2) + " €", 350, doc.y, {
      width: 100,
      align: "right",
    });
    doc.text(totalItem.toFixed(2) + " €", 450, doc.y, {
      width: 100,
      align: "right",
    });
    doc.moveDown(0.5);
  });

  doc.moveDown(1);
  doc
    .font("Helvetica-Bold")
    .fontSize(14)
    .text(`TOTAL : ${order.total.toFixed(2)} €`, { align: "right" });

  doc.end();
}

module.exports = generateInvoice;
