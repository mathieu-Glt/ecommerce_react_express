/**
 * @file cloudinaryUpload.js
 * @description
 * Cloudinary and Local File Upload Middleware
 *
 * Provides functionality to handle image uploads:
 *  - Temporary storage using multer
 *  - Upload to Cloudinary if configured
 *  - Fallback to local storage if Cloudinary is not configured
 *  - Deletion of images from Cloudinary
 *
 * Responsibilities:
 *  - Validate uploaded files (images only, max 5MB)
 *  - Handle temporary storage
 *  - Upload files to Cloudinary or save locally
 *  - Attach uploaded image info to request object (`req.cloudinaryImages`)
 *  - Delete images from Cloudinary using public IDs
 *
 * Dependencies:
 *  - multer (for file parsing)
 *  - fs and path (for filesystem operations)
 *  - ../config/cloudinary (custom Cloudinary config with uploadImage and deleteImage functions)
 */

/**
 * Multer temporary storage configuration
 * - Stores files temporarily in `uploads/temp`
 * - Ensures unique filenames using timestamp + random number
 * - Limits file size to 5MB
 * - Only accepts image MIME types
 * @module middleware/cloudinaryUpload
 * @requires multer
 * @requires fs
 * @requires path
 * @requires ../config/cloudinary
 *
 * - util link: https://cloudinary.com/documentation/node_integration
 * - multer doc: https://www.npmjs.com/package/multer
 * - fs doc: https://nodejs.org/api/fs.html
 */
const multer = require("multer");
const { uploadImage, deleteImage } = require("../config/cloudinary");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/temp");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

/**
 * Middleware to upload files to Cloudinary (or local storage fallback)
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 *
 * @property {Array} req.files - Array of uploaded files from multer
 * @property {Array} req.cloudinaryImages - Array of uploaded image info added by this middleware
 *
 * @returns {void} Calls next() if successful, or sends 500 error response on failure
 */
const uploadToCloudinary = async (req, res, next) => {
  try {
    console.log("=== CLOUDINARY MIDDLEWARE START ===");
    console.log("1. req.files:", req.files);
    console.log("2. Number of files:", req.files?.length || 0);

    if (!req.files || req.files.length === 0) {
      console.log("⚠️ No files to upload");
      req.cloudinaryImages = [];
      return next();
    }

    const isCloudinaryConfigured =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET;

    console.log("3. Cloudinary configured:", isCloudinaryConfigured);
    console.log(
      "4. CLOUDINARY_CLOUD_NAME:",
      process.env.CLOUDINARY_CLOUD_NAME ? "EXISTS" : "MISSING"
    );
    console.log(
      "5. CLOUDINARY_API_KEY:",
      process.env.CLOUDINARY_API_KEY ? "EXISTS" : "MISSING"
    );
    console.log(
      "6. CLOUDINARY_API_SECRET:",
      process.env.CLOUDINARY_API_SECRET ? "EXISTS" : "MISSING"
    );

    const uploadedImages = [];

    if (!isCloudinaryConfigured) {
      console.log("📁 Using local storage (Cloudinary not configured)");
      for (const file of req.files) {
        const uploadDir = path.join(__dirname, "../uploads");
        if (!fs.existsSync(uploadDir))
          fs.mkdirSync(uploadDir, { recursive: true });

        const fileName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(uploadDir, fileName);

        fs.copyFileSync(file.path, filePath);
        fs.unlinkSync(file.path);

        uploadedImages.push({
          originalName: file.originalname,
          url: `/uploads/${fileName}`,
          local: true,
        });
        console.log("✅ Image saved locally:", filePath);
      }
    } else {
      console.log("☁️ Uploading to Cloudinary...");
      for (const file of req.files) {
        console.log("📤 Uploading:", file.originalname);
        console.log("📍 File path:", file.path);

        const result = await uploadImage(file.path);
        console.log("📥 Upload result:", result);

        if (result.success) {
          uploadedImages.push({
            originalName: file.originalname,
            public_id: result.public_id,
            url: result.url,
            width: result.width,
            height: result.height,
          });
          console.log("✅ Image uploaded:", result.url);
        } else {
          throw new Error(
            `Upload error for ${file.originalname}: ${result.error}`
          );
        }

        fs.unlinkSync(file.path);
      }
    }

    req.cloudinaryImages = uploadedImages;
    console.log("7. req.cloudinaryImages created:", req.cloudinaryImages);
    console.log("=== CLOUDINARY MIDDLEWARE END ===");

    next();
  } catch (error) {
    console.error("❌ Cloudinary middleware error:", error);

    if (req.files) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      });
    }

    res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};
/**
 * Delete images from Cloudinary
 *
 * @param {Array<string>} publicIds - Array of Cloudinary public IDs to delete
 * @returns {Promise<Array>} Array of deletion results
 * @throws Will throw if deletion fails
 */
const deleteFromCloudinary = async (publicIds) => {
  try {
    const results = [];
    for (const publicId of publicIds) {
      console.log("Deleting from Cloudinary:", publicId);
      const result = await deleteImage(publicId);
      results.push({ publicId, ...result });
    }
    return results;
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    throw error;
  }
};

module.exports = {
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
};
