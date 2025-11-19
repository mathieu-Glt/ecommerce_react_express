const multer = require("multer");
const path = require("path");
const fs = require("fs");
// Useful link for the multer documentation :https://www.npmjs.com/package/multer
// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Destination folder for avatars
    const uploadPath = path.join(__dirname, "../uploads/avatars");

    // Create the folder if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = `avatar-${uniqueSuffix}${ext}`;

    cb(null, filename);
  },
});

// Filter accepted file types (images only)
const fileFilter = (req, file, cb) => {
  // Define allowed file types (regex)
  const allowedTypes = /jpeg|jpg|png|gif|webp/;

  // Check file extension
  // Example: "photo.jpg" → ".jpg" → "jpg" → test if it matches the regex
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  // Check the MIME type of the file
  // Example: "image/jpeg" → test if it matches the regex
  const mimetype = allowedTypes.test(file.mimetype);

  // Accept only if EXTENSION AND MIMETYPE are valid
  if (mimetype && extname) {
    return cb(null, true); // Accept the file
  } else {
    // Reject the file with an error message
    cb(new Error("Only images are allowed (jpeg, jpg, png, gif, webp)"));
  }
};
// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit of 5MB
  },
  fileFilter: fileFilter,
});

// Middleware to handle multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "The file is too large. Maximum size: 5MB",
      });
    }
    return res.status(400).json({
      success: false,
      error: `Upload error: ${err.message}`,
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
  uploadAvatar: upload.single("picture"), // For a single file with the field 'avatar'
  uploadMultiple: upload.array("pictures", 10), // For multiple files (max 10)
  handleMulterError,
};
