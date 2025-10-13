const multer = require("multer");
const path = require("path");
const fs = require("fs");
// lien util pour la doc multer :https://www.npmjs.com/package/multer
// Configuration du stockage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Dossier de destination pour les avatars
    const uploadPath = path.join(__dirname, "../uploads/avatars");

    // Créer le dossier s'il n'existe pas
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Générer un nom de fichier unique
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = `avatar-${uniqueSuffix}${ext}`;

    cb(null, filename);
  },
});

// Filtrer les types de fichiers acceptés (seulement images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      new Error("Seules les images sont autorisées (jpeg, jpg, png, gif, webp)")
    );
  }
};

// Configuration de multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB
  },
  fileFilter: fileFilter,
});

// Middleware pour gérer les erreurs multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "Le fichier est trop volumineux. Taille maximale : 5MB",
      });
    }
    return res.status(400).json({
      success: false,
      error: `Erreur d'upload: ${err.message}`,
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
  next();
};

module.exports = {
  uploadAvatar: upload.single("picture"), // Pour un seul fichier avec le champ 'avatar'
  uploadMultiple: upload.array("pictures", 10), // Pour plusieurs fichiers (max 10)
  handleMulterError,
};
