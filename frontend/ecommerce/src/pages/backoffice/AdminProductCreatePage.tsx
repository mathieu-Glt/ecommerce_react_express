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

  // State pour les sous-catégories filtrées
  const [filteredSubs, setFilteredSubs] = useState<SubCategory[]>([]);
  let csrfToken: string | null = null;

  // State UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Couleurs disponibles
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

  // Marques disponibles
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
      console.error("❌ Error fetching categories:", err);
      setError("Erreur lors du chargement des catégories");
    }
  };

  const fetchSubCategories = async () => {
    try {
      await getAllSubCategories();
    } catch (err) {
      console.error("❌ Error fetching subcategories:", err);
      setError("Erreur lors du chargement des sous-catégories");
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
        // ✅ LOGS DE DEBUG COMPLETS
        console.log("=== DEBUG IMAGES ===");
        console.log("1. values.images:", values.images);
        console.log("2. values.images type:", typeof values.images);
        console.log("3. Is array?:", Array.isArray(values.images));
        console.log("4. Length:", values.images?.length);
        // Ajouter les images
        if (values.images && values.images.length > 0) {
          values.images.forEach((image) => {
            formDataToSend.append("images", image as File);
          });
        }
        console.log("📦 FormData prepared for submission: ", values);
        console.log("🔄 Submitting product : ", formDataToSend);

        // ✅ VÉRIFIER LE CONTENU DU FORMDATA
        console.log("6. FormData contents:");
        for (let [key, value] of formDataToSend.entries()) {
          if (value instanceof File) {
            console.log(
              `   - ${key}:`,
              value.name,
              value.size,
              "bytes",
              value.type
            );
          } else {
            console.log(`   - ${key}:`, value);
          }
        }
        console.log("===================");

        console.log("🔄 Calling createProduct...");

        try {
          await createProduct(formDataToSend);
        } catch (err) {
          console.error("❌ Error post product:", err);
          setError("Erreur lors de la création du produit");
        }

        setSuccess("Produit créé avec succès !");

        // Réinitialiser le formulaire
        resetForm();
        setImagePreviews([]);

        // Faire défiler vers le haut pour voir le message de succès
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err: any) {
        console.error("❌ Error creating product:", err);

        // Gérer les erreurs du backend
        if (err.response?.data?.errors) {
          setErrors(err.response.data.errors);
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Erreur lors de la création du produit");
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
      console.log("=== 🖼️ handleImageChange START ===");

      // ✅ CORRECTION : Récupérer TOUS les fichiers
      const files = e.currentTarget.files;
      console.log("1. files:", files);
      console.log("2. files type:", typeof files);
      console.log("3. files instanceof FileList:", files instanceof FileList);

      if (!files || files.length === 0) {
        console.log("❌ No files, returning");
        return;
      }

      console.log("4. Converting files to array...");
      const fileArray = Array.from(files); // ✅ Maintenant ça fonctionne correctement
      console.log("5. fileArray:", fileArray);
      console.log("6. fileArray length:", fileArray.length);
      console.log("7. Getting currentImages from formik...");
      const currentImages = formik.values.images || [];
      console.log("8. currentImages:", currentImages);
      console.log("9. currentImages length:", currentImages.length);

      // Vérifie le nombre total d'images
      console.log("10. Checking total images count...");
      if (fileArray.length + currentImages.length > 5) {
        console.log("❌ Too many images");
        formik.setFieldError("images", "Maximum 5 images autorisées");
        return;
      }
      console.log("✅ Images count OK");

      // Vérifie la taille de chaque fichier
      console.log("11. Checking file sizes...");
      const maxSize = 5 * 1024 * 1024;
      for (const file of fileArray) {
        console.log(`   Checking ${file.name}: ${file.size} bytes`);
        if (file.size > maxSize) {
          console.log(`❌ File ${file.name} too large`);
          formik.setFieldError("images", `L'image ${file.name} dépasse 5MB`);
          return;
        }
      }
      console.log("✅ All file sizes OK");

      // Créer le nouveau tableau d'images
      console.log("12. Creating updatedImages...");
      const updatedImages = [...currentImages, ...fileArray];
      console.log("13. updatedImages:", updatedImages);
      console.log("14. updatedImages length:", updatedImages.length);

      // Mettre à jour Formik
      console.log("15. Calling formik.setFieldValue...");
      formik.setFieldValue("images", updatedImages);
      console.log("16. setFieldValue done");

      console.log("17. Calling formik.setFieldTouched...");
      formik.setFieldTouched("images", true);
      console.log("18. setFieldTouched done");

      // Créer les aperçus
      console.log("19. Creating previews...");
      const newPreviews = fileArray.map((file) => {
        console.log(`   Creating preview for ${file.name}`);
        return URL.createObjectURL(file);
      });
      console.log("20. newPreviews:", newPreviews);

      console.log("21. Updating imagePreviews state...");
      setImagePreviews((prev) => {
        const updated = [...prev, ...newPreviews];
        console.log("22. New imagePreviews state:", updated);
        return updated;
      });

      console.log(
        "23. Final check - formik.values.images:",
        formik.values.images
      );
      console.log("=== 🖼️ handleImageChange END ===");
    } catch (error) {
      console.error("❌ ERROR in handleImageChange:", error);
      console.error("Error stack:", error.stack);
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
      console.log("🔍 Filtering subs for category:", formik.values.category);

      const filtered = subCategories.filter(
        (sub) => sub.parent === formik.values.category
      );

      console.log("🔍 Filtered subs:", filtered);
      setFilteredSubs(filtered);

      // Réinitialiser la sous-catégorie si elle n'est plus valide
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

  // Log pour debug
  console.log("📊 Formik state:", {
    values: formik.values,
    errors: formik.errors,
    touched: formik.touched,
    isValid: formik.isValid,
    dirty: formik.dirty,
  });

  console.log("📊 Categories:", categories);
  console.log("📊 SubCategories:", subCategories);
  console.log("📊 Filtered subs:", filteredSubs);

  // ==================== RENDER ====================
  return (
    <div className="product-create-page">
      <div className="page-header">
        <h1>📱 Créer un nouveau produit</h1>
        <p>Ajoutez un nouveau produit à votre catalogue</p>
      </div>

      {/* Message d'erreur global */}
      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">❌</span>
          {error}
        </div>
      )}

      {/* Message de succès */}
      {success && (
        <div className="alert alert-success">
          <span className="alert-icon">✅</span>
          {success}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="product-form-create">
        {/* INFORMATIONS GÉNÉRALES */}
        <div className="form-section">
          <h2 className="section-title">📝 Informations générales</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="title">
                Titre du produit <span className="required">*</span>
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
                Généré automatiquement à partir du titre
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

        {/* CATÉGORISATION */}
        <div className="form-section">
          <h2 className="section-title">🏷️ Catégorisation</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">
                Catégorie <span className="required">*</span>
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
                <option value="">Sélectionnez une catégorie</option>
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
                  ⚠️ Aucune catégorie disponible
                </small>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="sub">Sous-catégorie</label>
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
                <option value="">Sélectionnez une sous-catégorie</option>
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
                  Sélectionnez d'abord une catégorie
                </small>
              )}
              {formik.values.category && filteredSubs.length === 0 && (
                <small className="form-hint text-warning">
                  ⚠️ Aucune sous-catégorie pour cette catégorie
                </small>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="brand">
                Marque <span className="required">*</span>
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
                <option value="">Sélectionnez une marque</option>
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
                Couleur <span className="required">*</span>
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
                <option value="">Sélectionnez une couleur</option>
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

        {/* PRIX ET STOCK */}
        <div className="form-section">
          <h2 className="section-title">💰 Prix et stock</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">
                Prix (€) <span className="required">*</span>
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
                Quantité en stock <span className="required">*</span>
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
              <label htmlFor="shipping">Livraison</label>
              <select
                id="shipping"
                name="shipping"
                value={formik.values.shipping}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={loading}
              >
                <option value="No">Non disponible</option>
                <option value="Yes">Disponible</option>
              </select>
            </div>
          </div>
        </div>

        {/* IMAGES */}
        <div className="form-section">
          <h2 className="section-title">📸 Images du produit</h2>

          <div className="form-group">
            <label htmlFor="images">
              Ajouter des images (Max: 5 images, 5MB chacune)
            </label>
            <div className="image-upload-container">
              <label htmlFor="images" className="image-upload-label">
                <div className="upload-icon">📁</div>
                <span>Cliquez pour sélectionner des images</span>
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
                ✓ {formik.values.images.length} image(s) sélectionnée(s)
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
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !formik.isValid || !formik.dirty}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Création en cours...
              </>
            ) : (
              <>
                <span>✅</span>
                Créer le produit
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default React.memo(AdminProductCreatePage);
