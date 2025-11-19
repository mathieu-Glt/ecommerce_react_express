// src/pages/backoffice/AdminProductCreatePage.tsx
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import axios, { type AxiosInstance } from "axios";
import "../styles/admin-product-create.css";
import useCategory from "../../hooks/useCategory";
import useSubCategory from "../../hooks/useSubCategory";
import { productValidationSchema } from "../../validators/validatorFormProduct";
import type { ProductFormValues } from "../../validators/validatorFormProduct";
import { useProduct } from "../../hooks/useProduct";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  parent: string;
}

const AdminProductCreatePage = () => {
  const { getAllCategories, categories } = useCategory();
  const { getAllSubCategories, subCategories } = useSubCategory();
  const { createProduct } = useProduct();

  // State for the filtered subcategoriess
  const [filteredSubs, setFilteredSubs] = useState<SubCategory[]>([]);
  let csrfToken: string | null = null;

  // State UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Available colors
  const colors = [
    "Black",
    "White",
    "Silver",
    "Gold",
    "Yellow",
    "Blue",
    "Red",
    "Green",
    "Purple",
    "Brown",
    "Gray",
  ];

  // Available brands
  const brands = [
    "Apple",
    "Samsung",
    "Xiaomi",
    "Huawei",
    "OnePlus",
    "Google",
    "Oppo",
    "Vivo",
    "Realme",
    "Motorola",
    "Sony",
    "Nokia",
    "Transsion",
    "Autre",
  ];

  // ==================== FETCH CATEGORIES & SUBCATEGORIES ====================
  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      await getAllCategories();
    } catch (err) {
      setError("Error loading categories");
    }
  };

  const fetchSubCategories = async () => {
    try {
      await getAllSubCategories();
    } catch (err) {
      setError("Error loading subcategories");
    }
  };

  // ==================== AUTO-GENERATE SLUG ====================
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  // ==================== FORMIK SETUP ====================
  const initialValues: ProductFormValues = {
    title: "",
    slug: "",
    price: 0,
    description: "",
    category: "",
    sub: "",
    quantity: 0,
    shipping: "No",
    color: "",
    brand: "",
    images: [],
  };

  const formik = useFormik({
    initialValues,
    validationSchema: productValidationSchema,
    onSubmit: async (values, { setErrors, setFieldError, resetForm }) => {
      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const formDataToSend = new FormData();
        formDataToSend.append("title", values.title);
        formDataToSend.append("slug", values.slug);
        formDataToSend.append("price", values.price.toString());
        formDataToSend.append("description", values.description);
        formDataToSend.append("category", values.category);
        formDataToSend.append("sub", values.sub || "");
        formDataToSend.append("quantity", values.quantity.toString());
        formDataToSend.append("shipping", values.shipping);
        formDataToSend.append("color", values.color);
        formDataToSend.append("brand", values.brand);
        // Add images
        if (values.images && values.images.length > 0) {
          values.images.forEach((image) => {
            formDataToSend.append("images", image as File);
          });
        }

        // VERIFY FORM DATA CONTENTS
        for (let [key, value] of formDataToSend.entries()) {
          if (value instanceof File) {
          } else {
            console.log(`${key}: ${value}`);
          }
        }

        try {
          await createProduct(formDataToSend);
        } catch (err) {
          setError("Error creating product");
        }

        setSuccess("Product created successfully!");

        // Reset the form
        resetForm();
        setImagePreviews([]);

        // Scroll to top to see the success message
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err: any) {
        // Handle backend errors
        if (err.response?.data?.errors) {
          setErrors(err.response.data.errors);
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Error creating product");
        }
      } finally {
        setLoading(false);
      }
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  // ==================== TITLE CHANGE HANDLER (auto-generate slug) ====================
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    formik.handleChange(e);
    formik.setFieldValue("slug", generateSlug(title));
  };

  // ==================== IMAGE UPLOAD HANDLER ====================
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      // CORRECTION: Retrieve ALL files
      const files = e.currentTarget.files;

      if (!files || files.length === 0) {
        return;
      }

      const fileArray = Array.from(files); // Now it works correctly
      const currentImages = formik.values.images || [];

      // Verify total number of images
      if (fileArray.length + currentImages.length > 5) {
        formik.setFieldError("images", "Maximum 5 images allowed");
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      for (const file of fileArray) {
        if (file.size > maxSize) {
          formik.setFieldError("images", `Image ${file.name} exceeds 5MB`);
          return;
        }
      }

      // Create the new images array
      const updatedImages = [...currentImages, ...fileArray];

      // Update Formik
      formik.setFieldValue("images", updatedImages);

      formik.setFieldTouched("images", true);

      // Create previews
      const newPreviews = fileArray.map((file) => {
        return URL.createObjectURL(file);
      });
      setImagePreviews((prev) => {
        const updated = [...prev, ...newPreviews];
        return updated;
      });
    } catch (error) {
      formik.setFieldError("images", "Error uploading images");
    }
  };
  // ==================== REMOVE IMAGE ====================
  const removeImage = (index: number) => {
    const currentImages = formik.values.images || [];
    const updatedImages = currentImages.filter((_, i) => i !== index);
    formik.setFieldValue("images", updatedImages);
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ==================== FILTER SUBCATEGORIES BY CATEGORY ====================
  useEffect(() => {
    if (formik.values.category) {
      const filtered = subCategories.filter(
        (sub) => sub.parent === formik.values.category
      );

      setFilteredSubs(filtered);

      // Reset subcategory if it is no longer valid
      if (
        formik.values.sub &&
        !filtered.find((s) => s._id === formik.values.sub)
      ) {
        formik.setFieldValue("sub", "");
      }
    } else {
      setFilteredSubs([]);
      formik.setFieldValue("sub", "");
    }
  }, [formik.values.category, subCategories]);

  // ==================== RENDER ====================
  return (
    <div className="product-create-page">
      <div className="page-header">
        <h1>📱 Create a new product</h1>
        <p>Add a new product to your catalog</p>
      </div>

      {/* Global error message */}
      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">❌</span>
          {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="alert alert-success">
          <span className="alert-icon">✅</span>
          {success}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="product-form-create">
        {/* GENERAL INFORMATION */}
        <div className="form-section">
          <h2 className="section-title">📝 General Information</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">
                Product Title <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formik.values.title}
                onChange={handleTitleChange}
                onBlur={formik.handleBlur}
                placeholder="Ex: iPhone 15 Pro Max"
                className={
                  formik.touched.title && formik.errors.title
                    ? "input-error"
                    : formik.touched.title
                    ? "input-success"
                    : ""
                }
                disabled={loading}
              />
              {formik.touched.title && formik.errors.title && (
                <span className="error-message">{formik.errors.title}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="slug">
                Slug (URL) <span className="required">*</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formik.values.slug}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="iphone-15-pro-max"
                className={
                  formik.touched.slug && formik.errors.slug
                    ? "input-error"
                    : formik.touched.slug
                    ? "input-success"
                    : ""
                }
                disabled={loading}
              />
              {formik.touched.slug && formik.errors.slug && (
                <span className="error-message">{formik.errors.slug}</span>
              )}
              <small className="form-hint">
                Automatically generated from the title, but you can edit it.
              </small>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Description <span className="required">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Décrivez votre produit en détail..."
              rows={5}
              className={
                formik.touched.description && formik.errors.description
                  ? "input-error"
                  : formik.touched.description
                  ? "input-success"
                  : ""
              }
              disabled={loading}
            />
            {formik.touched.description && formik.errors.description && (
              <span className="error-message">{formik.errors.description}</span>
            )}
          </div>
        </div>

        {/* CATEGORIZATION */}
        <div className="form-section">
          <h2 className="section-title">🏷️ Categorization</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">
                Category <span className="required">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.category && formik.errors.category
                    ? "input-error"
                    : formik.touched.category
                    ? "input-success"
                    : ""
                }
                disabled={loading}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {formik.touched.category && formik.errors.category && (
                <span className="error-message">{formik.errors.category}</span>
              )}
              {categories.length === 0 && (
                <small className="form-hint text-warning">
                  ⚠️ No categories available. Please create one first.
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="sub">Sub-category</label>
              <select
                id="sub"
                name="sub"
                value={formik.values.sub || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={!formik.values.category || loading}
                className={
                  formik.touched.sub && formik.errors.sub
                    ? "input-error"
                    : formik.touched.sub
                    ? "input-success"
                    : ""
                }
              >
                <option value="">Select a sub-category</option>
                {subCategories.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
              {formik.touched.sub && formik.errors.sub && (
                <span className="error-message">{formik.errors.sub}</span>
              )}
              {!formik.values.category && (
                <small className="form-hint">
                  Please select a category first
                </small>
              )}
              {formik.values.category && filteredSubs.length === 0 && (
                <small className="form-hint text-warning">
                  ⚠️ No sub-categories for this category
                </small>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="brand">
                Brand <span className="required">*</span>
              </label>
              <select
                id="brand"
                name="brand"
                value={formik.values.brand}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.brand && formik.errors.brand
                    ? "input-error"
                    : formik.touched.brand
                    ? "input-success"
                    : ""
                }
                disabled={loading}
              >
                <option value="">Select a brand</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
              {formik.touched.brand && formik.errors.brand && (
                <span className="error-message">{formik.errors.brand}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="color">
                Color <span className="required">*</span>
              </label>
              <select
                id="color"
                name="color"
                value={formik.values.color}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={
                  formik.touched.color && formik.errors.color
                    ? "input-error"
                    : formik.touched.color
                    ? "input-success"
                    : ""
                }
                disabled={loading}
              >
                <option value="">Select a color</option>
                {colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
              {formik.touched.color && formik.errors.color && (
                <span className="error-message">{formik.errors.color}</span>
              )}
            </div>
          </div>
        </div>

        {/* PRICE AND STOCK */}
        <div className="form-section">
          <h2 className="section-title">Price and Stock</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">
                Price (€) <span className="required">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formik.values.price || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={
                  formik.touched.price && formik.errors.price
                    ? "input-error"
                    : formik.touched.price
                    ? "input-success"
                    : ""
                }
                disabled={loading}
              />
              {formik.touched.price && formik.errors.price && (
                <span className="error-message">{formik.errors.price}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="quantity">
                Quantity in stock <span className="required">*</span>
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formik.values.quantity || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="0"
                min="0"
                className={
                  formik.touched.quantity && formik.errors.quantity
                    ? "input-error"
                    : formik.touched.quantity
                    ? "input-success"
                    : ""
                }
                disabled={loading}
              />
              {formik.touched.quantity && formik.errors.quantity && (
                <span className="error-message">{formik.errors.quantity}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="shipping">Shipping</label>
              <select
                id="shipping"
                name="shipping"
                value={formik.values.shipping}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
              >
                <option value="No">Not available</option>
                <option value="Yes">Available</option>
              </select>
            </div>
          </div>
        </div>

        {/* IMAGES */}
        <div className="form-section">
          <h2 className="section-title">Product Images</h2>

          <div className="form-group">
            <label htmlFor="images">Add images (Max: 5 images, 5MB each)</label>
            <div className="image-upload-container">
              <label htmlFor="images" className="image-upload-label">
                <div className="upload-icon">📁</div>
                <span>Click to select images</span>
                <small>PNG, JPG, WEBP jusqu'à 5MB</small>
              </label>
              <input
                type="file"
                id="images"
                name="images"
                onChange={handleImageChange}
                onBlur={formik.handleBlur}
                accept="image/*"
                multiple
                style={{ display: "none" }}
                disabled={loading}
              />
            </div>

            {formik.touched.images && formik.errors.images && (
              <span className="error-message">{formik.errors.images}</span>
            )}

            {imagePreviews.length > 0 && (
              <div className="image-previews">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeImage(index)}
                      title="Supprimer l'image"
                      disabled={loading}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {formik.values.images && formik.values.images.length > 0 && (
              <small className="form-hint text-success">
                ✓ {formik.values.images.length} image(s) selected
              </small>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => window.history.back()}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !formik.isValid || !formik.dirty}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Creating...
              </>
            ) : (
              <>
                <span>✅</span>
                Create Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default React.memo(AdminProductCreatePage);
