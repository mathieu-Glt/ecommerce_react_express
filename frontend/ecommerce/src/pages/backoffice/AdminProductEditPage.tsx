// src/pages/backoffice/AdminProductEditPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import "../styles/admin-product-edit.css";
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

interface ExistingImage {
  public_id: string;
  url: string;
}

const AdminProductEditPage = () => {
  const { id } = useParams<{ id: string }>();
  console.log("Editing product with ID:", id);
  const navigate = useNavigate();
  const { getAllCategories, categories } = useCategory();
  const { getAllSubCategories, subCategories } = useSubCategory();
  const { getProductById, updateProduct, selectedProduct } = useProduct();

  // State pour les sous-catégories filtrées
  const [filteredSubs, setFilteredSubs] = useState<SubCategory[]>([]);

  // State UI
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State pour les images
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([]);

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

  // ==================== FETCH PRODUCT, CATEGORIES & SUBCATEGORIES ====================
  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoadingProduct(true);
      await getProductById(productId);
    } catch (err) {
      console.error("❌ Error fetching product:", err);
      setError("Erreur lors du chargement du produit");
    } finally {
      setLoadingProduct(false);
    }
  };

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
    enableReinitialize: true, // ✅ Important pour mettre à jour avec les données du produit
    onSubmit: async (values, { setErrors, setFieldError }) => {
      if (!id) return;

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
        if (values.sub) {
          formDataToSend.append("sub", values.sub);
        }
        formDataToSend.append("quantity", values.quantity.toString());
        formDataToSend.append("shipping", values.shipping);
        formDataToSend.append("color", values.color);
        formDataToSend.append("brand", values.brand);

        // ✅ Ajouter les IDs des images existantes à conserver
        existingImages.forEach((img) => {
          formDataToSend.append("existingImages", img.public_id);
        });

        // ✅ Ajouter les nouvelles images (File objects)
        if (values.images && values.images.length > 0) {
          values.images.forEach((image) => {
            formDataToSend.append("images", image as File);
          });
        }

        console.log("📦 FormData prepared for update");
        console.log("Existing images to keep:", existingImages.length);
        console.log("New images to upload:", values.images.length);

        await updateProduct(id, formDataToSend);

        setSuccess("Produit mis à jour avec succès !");

        // Faire défiler vers le haut pour voir le message de succès
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Rediriger vers la liste des produits après 2 secondes
        // setTimeout(() => {
        //   navigate("/admin/products");
        // }, 2000);
      } catch (err: any) {
        console.error("❌ Error updating product:", err);

        // Gérer les erreurs du backend
        if (err.response?.data?.errors) {
          setErrors(err.response.data.errors);
        } else if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Erreur lors de la mise à jour du produit");
        }
      } finally {
        setLoading(false);
      }
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  // ==================== POPULATE FORM WITH PRODUCT DATA ====================
  useEffect(() => {
    if (selectedProduct && selectedProduct._id === id) {
      console.log("📝 Populating form with product data:", selectedProduct);

      // Remplir le formulaire avec les données du produit
      formik.setValues({
        title: selectedProduct.title || "",
        slug: selectedProduct.slug || "",
        price: selectedProduct.price || 0,
        description: selectedProduct.description || "",
        category: selectedProduct.category?._id || "",
        sub: selectedProduct.sub?._id || "",
        quantity: selectedProduct.quantity || 0,
        shipping: selectedProduct.shipping || "No",
        color: selectedProduct.color || "",
        brand: selectedProduct.brand || "",
        images: [], // Nouvelles images (vide au départ)
      });

      // Définir les images existantes
      if (selectedProduct.images && selectedProduct.images.length > 0) {
        setExistingImages(selectedProduct.images);
      }
    }
  }, [selectedProduct, id]);

  // ==================== TITLE CHANGE HANDLER (auto-generate slug) ====================
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    formik.handleChange(e);
    formik.setFieldValue("slug", generateSlug(title));
  };

  // ==================== REMOVE EXISTING IMAGE ====================
  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ==================== NEW IMAGE UPLOAD HANDLER ====================
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      console.log("=== 🖼️ handleImageChange START ===");

      const files = e.currentTarget.files;
      if (!files || files.length === 0) {
        console.log("❌ No files, returning");
        return;
      }

      const fileArray = Array.from(files);
      const currentImages = formik.values.images || [];
      const totalImages =
        existingImages.length + currentImages.length + fileArray.length;

      // Vérifie le nombre total d'images (existantes + nouvelles)
      if (totalImages > 5) {
        console.log("❌ Too many images");
        formik.setFieldError("images", "Maximum 5 images au total autorisées");
        return;
      }

      // Vérifie la taille de chaque fichier
      const maxSize = 5 * 1024 * 1024;
      for (const file of fileArray) {
        if (file.size > maxSize) {
          console.log(`❌ File ${file.name} too large`);
          formik.setFieldError("images", `L'image ${file.name} dépasse 5MB`);
          return;
        }
      }

      // Créer le nouveau tableau d'images
      const updatedImages = [...currentImages, ...fileArray];
      formik.setFieldValue("images", updatedImages);
      formik.setFieldTouched("images", true);

      // Créer les aperçus
      const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
      setNewImagePreviews((prev) => [...prev, ...newPreviews]);

      console.log("✅ Images added successfully");
      console.log("=== 🖼️ handleImageChange END ===");
    } catch (error) {
      console.error("❌ ERROR in handleImageChange:", error);
    }
  };

  // ==================== REMOVE NEW IMAGE ====================
  const removeNewImage = (index: number) => {
    const currentImages = formik.values.images || [];
    const updatedImages = currentImages.filter((_, i) => i !== index);
    formik.setFieldValue("images", updatedImages);
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ==================== FILTER SUBCATEGORIES BY CATEGORY ====================
  useEffect(() => {
    if (formik.values.category) {
      const filtered = subCategories.filter(
        (sub) => sub.parent === formik.values.category
      );
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

  // ==================== LOADING STATE ====================
  if (loadingProduct) {
    return (
      <div className="product-create-page">
        <div className="page-header">
          <h1>⏳ Chargement...</h1>
          <p>Chargement du produit en cours...</p>
        </div>
      </div>
    );
  }

  if (!selectedProduct || selectedProduct._id !== id) {
    return (
      <div className="product-edit-page">
        <div className="page-header">
          <h1>❌ Produit non trouvé</h1>
          <p>Le produit que vous cherchez n'existe pas.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/products")}
        >
          Retour à la liste
        </button>
      </div>
    );
  }

  // ==================== RENDER ====================
  return (
    <div className="product-edit-page">
      <div className="page-header">
        <h1>✏️ Modifier le produit</h1>
        <p>Modifiez les informations de votre produit</p>
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

      <form onSubmit={formik.handleSubmit} className="product-form-edit">
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

          {/* Images existantes */}
          {existingImages.length > 0 && (
            <div className="form-group">
              <label>Images actuelles</label>
              <div className="image-previews">
                {existingImages.map((img, index) => (
                  <div key={img.public_id} className="image-preview-item">
                    <img src={img.url} alt={`Existing ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeExistingImage(index)}
                      title="Supprimer l'image"
                      disabled={loading}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <small className="form-hint">
                {existingImages.length} image(s) actuelle(s)
              </small>
            </div>
          )}

          {/* Nouvelles images */}
          <div className="form-group">
            <label htmlFor="images">
              Ajouter de nouvelles images (Max: 5 images au total, 5MB chacune)
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

            {newImagePreviews.length > 0 && (
              <div className="image-previews">
                {newImagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={preview} alt={`New Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeNewImage(index)}
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
                ✓ {formik.values.images.length} nouvelle(s) image(s)
                sélectionnée(s)
              </small>
            )}

            <small className="form-hint">
              Total:{" "}
              {existingImages.length + (formik.values.images?.length || 0)}/5
              images
            </small>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate("/admin/products")}
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
                Mise à jour en cours...
              </>
            ) : (
              <>
                <span>✅</span>
                Mettre à jour le produit
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default React.memo(AdminProductEditPage);
