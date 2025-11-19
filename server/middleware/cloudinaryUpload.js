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
    // Set the path of the destination folder _dirname is the current folder
    const uploadDir = path.join(__dirname, "../uploads/temp");
    // Check if the folder exists, otherwise create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // Call the callback with the unique file path
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
/**
 * Middleware to upload files to Cloudinary or locally
 * - If Cloudinary is configured: upload to the cloud
 * - Otherwise: save locally in the /uploads folder
 *
 * @param {Object} req - Express request (must contain req.files via multer)
 * @param {Object} res - Express response
 * @param {Function} next - next() function to pass to the next middleware
 */
const uploadToCloudinary = async (req, res, next) => {
  try {
    // If no file was uploaded, initialize an empty array and continue
    if (!req.files || req.files.length === 0) {
      req.cloudinaryImages = [];
      return next();
    }

    // Check that all Cloudinary environment variables are present
    const isCloudinaryConfigured =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET;

    // Array to store uploaded images information
    const uploadedImages = [];

    // ========== LOCAL MODE (without Cloudinary) ==========
    if (!isCloudinaryConfigured) {
      // Loop through all received files
      for (const file of req.files) {
        // Define the local storage folder path
        const uploadDir = path.join(__dirname, "../uploads");

        // Create the uploads folder if it doesn't exist yet
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Generate a unique filename (timestamp + original name)
        const fileName = `${Date.now()}-${file.originalname}`;

        // Build the full destination file path
        const filePath = path.join(uploadDir, fileName);

        // Copy the file from temporary folder to uploads folder
        fs.copyFileSync(file.path, filePath);

        // Delete the temporary file created by multer
        fs.unlinkSync(file.path);

        // Add file information to the array
        uploadedImages.push({
          originalName: file.originalname,
          url: `/uploads/${fileName}`, // Relative URL to serve the file
          local: true, // Flag to differentiate local/cloud storage
        });
      }
    }
    // ========== CLOUDINARY MODE (with configuration) ==========
    else {
      // Loop through all received files
      for (const file of req.files) {
        // Upload the file to Cloudinary
        const result = await uploadImage(file.path);

        // If upload was successful
        if (result.success) {
          // Add information returned by Cloudinary
          uploadedImages.push({
            originalName: file.originalname,
            public_id: result.public_id, // Unique Cloudinary ID to delete/modify
            url: result.url, // Public URL of the image on Cloudinary
            width: result.width, // Dimensions returned by Cloudinary
            height: result.height,
          });
        } else {
          // In case of failure, throw an error that will be caught
          throw new Error(
            `Upload error for ${file.originalname}: ${result.error}`
          );
        }

        // Delete the local temporary file after uploading to Cloudinary
        fs.unlinkSync(file.path);
      }
    }

    // Attach the uploaded images array to the request for subsequent middlewares
    req.cloudinaryImages = uploadedImages;

    // Pass to the next middleware (e.g., controller that will create the product with these images)
    next();
  } catch (error) {
    // ========== ERROR HANDLING ==========
    // Clean up all temporary files in case of error
    if (req.files) {
      req.files.forEach((file) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    // Return an error response to the client
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
      const result = await deleteImage(publicId);
      results.push({ publicId, ...result });
    }
    return results;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  upload,
  uploadToCloudinary,
  deleteFromCloudinary,
};
