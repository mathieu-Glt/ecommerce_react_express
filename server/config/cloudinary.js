/**
 * @file cloudinary.js
 * @description
 * Cloudinary Configuration and Utility Functions
 *
 * This module configures the Cloudinary SDK using environment variables
 * and provides utility functions for uploading, deleting, and generating
 * URLs for images.
 *
 * Environment Variables:
 *  - CLOUDINARY_CLOUD_NAME: Your Cloudinary cloud name
 *  - CLOUDINARY_API_KEY: Your Cloudinary API key
 *  - CLOUDINARY_API_SECRET: Your Cloudinary API secret
 *  doc utile :  - https://cloudinary.com/documentation/node_integration
 *               - https://cloudinary.com/documentation/node_image_and_video_upload
 *               - https://www.npmjs.com/package/cloudinary
 *               - https://cloudinary.com/documentation/image_upload_api_reference
 *               - https://github.com/cloudinary/cloudinary_npm?tab=readme-ov-file
 */
const cloudinary = require("cloudinary").v2;

// Configuration

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload an image
const uploadImage = async (filePath, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      resource_type: "auto",
      folder: "ecommerce",
      ...options,
    });

    return {
      success: true,
      public_id: result.public_id,
      url: result.secure_url,
      width: result.width,
      height: result.height,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Delete an image
const deleteImage = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return {
      success: true,
      message: `Image with public_id ${public_id} deleted successfully`,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Generate optimized image URL
const getOptimizedUrl = (public_id, options = {}) => {
  return cloudinary.url(public_id, {
    fetch_format: "auto",
    quality: "auto",
    ...options,
  });
};

// Generate thumbnail URL
const getThumbnailUrl = (public_id, width = 300, height = 300) => {
  return cloudinary.url(public_id, {
    crop: "fill",
    width,
    height,
    quality: "auto",
    fetch_format: "auto",
  });
};

module.exports = {
  cloudinary,
  uploadImage,
  deleteImage,
  getOptimizedUrl,
  getThumbnailUrl,
};
