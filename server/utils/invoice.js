const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
// Stripe facture generation
function generateInvoice(order, filePath) {
  // Assure que le dossier "invoices" existe
  const invoicesDir = path.dirname(filePath);
  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
  }

  const doc = new PDFDocument({ margin: 50 });
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  // ------------------------------
  // Logo en haut
  // ------------------------------
  const logoPath = path.join(__dirname, "..", "assets", "logo.png");
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 50, 20, { width: 100 });
  }

  doc.moveDown(4);

  // ------------------------------
  // Titre facture
  // ------------------------------
  doc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("FACTURE D'ACHAT", { align: "center" });
  doc.moveDown(0.5);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(); // ligne horizontale
  doc.moveDown(1);

  // ------------------------------
  // Informations client
  // ------------------------------
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

  // ------------------------------
  // Tableau des articles
  // ------------------------------
  doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("Articles achetés :", { underline: true });
  doc.moveDown(0.5);

  // En-tête du tableau
  doc.font("Helvetica-Bold");
  doc.text("Produit", 50, doc.y, { width: 220 });
  doc.text("Quantité", 270, doc.y, { width: 80, align: "right" });
  doc.text("Prix Unitaire", 350, doc.y, { width: 100, align: "right" });
  doc.text("Total", 450, doc.y, { width: 100, align: "right" });
  doc.moveDown(0.5);
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(0.2);

  // Articles
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
  console.log(`✅ Facture générée : ${path.basename(filePath)}`);
}

// Nouvelle version améliorée de la fonction de génération de facture
// function generateInvoice(order, filePath) {
//   const doc = new PDFDocument({ margin: 50 });

//   doc.pipe(fs.createWriteStream(filePath));

//   // === HEADER ===
//   const logoPath = path.join(__dirname, "..", "assets", "logo.png");
//   if (fs.existsSync(logoPath)) {
//     doc.image(logoPath, 50, 20, { width: 100 });
//   }
//   const fontPath = path.resolve(
//     __dirname,
//     "..",
//     "fonts",
//     "NotoSans-Regular.ttf"
//   );
//   console.log("Chemin de la police :", fontPath);

//   doc.moveDown(4);
//   doc.registerFont("NotoSans", fontPath);
//   doc.font("NotoSans").text("🛍️ Ma Boutique en Ligne", { align: "left" });
//   doc
//     .fontSize(10)
//     .fillColor("#444")
//     .text("123 Rue du Commerce, 75001 Paris")
//     .text("contact@maboutique.fr")
//     .text("www.maboutique.fr", { underline: true })
//     .moveDown();

//   doc
//     .fontSize(14)
//     .fillColor("#000")
//     .text("Facture", { align: "center" })
//     .moveDown();

//   // === CLIENT INFO ===
//   doc
//     .fontSize(12)
//     .fillColor("#000")
//     .text(`Client : ${order.user.name}`)
//     .text(`Email : ${order.user.email}`)
//     .moveDown();

//   // === TABLE HEADER ===
//   const tableTop = doc.y;
//   const itemX = 50;
//   const qtyX = 300;
//   const priceX = 370;
//   const totalX = 460;

//   doc
//     .font("Helvetica-Bold")
//     .fontSize(12)
//     .text("Désignation", itemX, tableTop)
//     .text("Qté", qtyX, tableTop)
//     .text("Prix", priceX, tableTop)
//     .text("Total", totalX, tableTop);

//   doc
//     .moveTo(50, tableTop + 15)
//     .lineTo(550, tableTop + 15)
//     .stroke();

//   // === TABLE CONTENT ===
//   let position = tableTop + 30;
//   doc.font("Helvetica").fontSize(11);

//   order.items.forEach((item) => {
//     doc
//       .text(item.product.title, 50, position, { width: 250 })
//       .text(item.quantity, 300, position, { width: 50, align: "right" })
//       .text(`${item.product.price.toFixed(2)} €`, 370, position, {
//         width: 70,
//         align: "right",
//       })
//       .text(
//         `${(item.product.price * item.quantity).toFixed(2)} €`,
//         460,
//         position,
//         { width: 90, align: "right" }
//       );
//     position += 20;
//   });

//   doc
//     .moveTo(50, position + 10)
//     .lineTo(550, position + 10)
//     .stroke();

//   // === TOTALS ===
//   const totalHT = order.total / 1.2;
//   const tva = order.total - totalHT;

//   doc
//     .font("Helvetica-Bold")
//     .text(`Total HT : ${totalHT.toFixed(2)} €`, { align: "right" })
//     .text(`TVA (20%) : ${tva.toFixed(2)} €`, { align: "right" })
//     .text(`Total TTC : ${order.total.toFixed(2)} €`, { align: "right" })
//     .moveDown(2);

//   // === FOOTER ===
//   doc
//     .fontSize(10)
//     .fillColor("#666")
//     .text("Merci pour votre achat ! 🙏", { align: "center" })
//     .text("Cette facture est générée automatiquement.", { align: "center" })
//     .text("© 2025 Ma Boutique en Ligne", { align: "center" });

//   doc.end();
// }

module.exports = generateInvoice;
