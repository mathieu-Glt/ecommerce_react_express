// src/pages/backoffice/AdminProductCreatePage.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/admin-product-create.css";

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

interface ProductFormData {
  title: string;
  slug: string;
  price: string;
  description: string;
  category: string;
  sub: string;
  quantity: string;
  shipping: string;
  color: string;
  brand: string;
  images: File[];
}

const AdminProductCreatePage = () => {
  // State du formulaire
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    slug: "",
    price: "",
    description: "",
    category: "",
    sub: "",
    quantity: "",
    shipping: "No",
    color: "",
    brand: "",
    images: [],
  });

  // State pour les listes déroulantes
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [filteredSubs, setFilteredSubs] = useState<SubCategory[]>([]);

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
    "Rose Gold",
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
    "Autre",
  ];

  // ==================== FETCH CATEGORIES & SUBCATEGORIES ====================
  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Erreur lors du chargement des catégories");
    }
  };

  const fetchSubCategories = async () => {
    try {
      const response = await axios.get("/api/subcategories");
      setSubCategories(response.data);
    } catch (err) {
      console.error("Error fetching subcategories:", err);
      setError("Erreur lors du chargement des sous-catégories");
    }
  };

  // ==================== FILTER SUBCATEGORIES BY CATEGORY ====================
  useEffect(() => {
    if (formData.category) {
      const filtered = subCategories.filter(
        (sub) => sub.parent === formData.category
      );
      setFilteredSubs(filtered);

      if (formData.sub && !filtered.find((s) => s._id === formData.sub)) {
        setFormData((prev) => ({ ...prev, sub: "" }));
      }
    } else {
      setFilteredSubs([]);
      setFormData((prev) => ({ ...prev, sub: "" }));
    }
  }, [formData.category, subCategories, formData.sub]);

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

  // ==================== HANDLE INPUT CHANGE ====================
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "title") {
      setFormData((prev) => ({ ...prev, slug: generateSlug(value) }));
    }
  };

  // ==================== HANDLE IMAGE UPLOAD ====================
  const handleImageChange = (e: any) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files) as File[];

    if (fileArray.length + formData.images.length > 5) {
      setError("Maximum 5 images autorisées");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    for (const file of fileArray) {
      if (file.size > maxSize) {
        setError(`L'image ${file.name} dépasse 5MB`);
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...fileArray],
    }));

    fileArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    setError("");
  };

  // ==================== REMOVE IMAGE ====================
  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ==================== VALIDATION ====================
  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setError("Le titre est requis");
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError("Le prix doit être supérieur à 0");
      return false;
    }
    if (!formData.description.trim()) {
      setError("La description est requise");
      return false;
    }
    if (!formData.category) {
      setError("La catégorie est requise");
      return false;
    }
    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      setError("La quantité doit être un nombre positif");
      return false;
    }
    if (!formData.color) {
      setError("La couleur est requise");
      return false;
    }
    if (!formData.brand) {
      setError("La marque est requise");
      return false;
    }
    return true;
  };

  // ==================== SUBMIT FORM ====================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("slug", formData.slug);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("sub", formData.sub);
      formDataToSend.append("quantity", formData.quantity);
      formDataToSend.append("shipping", formData.shipping);
      formDataToSend.append("color", formData.color);
      formDataToSend.append("brand", formData.brand);

      formData.images.forEach((image) => {
        formDataToSend.append("images", image);
      });

      const response = await axios.post("/api/products", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess("Produit créé avec succès !");

      setFormData({
        title: "",
        slug: "",
        price: "",
        description: "",
        category: "",
        sub: "",
        quantity: "",
        shipping: "No",
        color: "",
        brand: "",
        images: [],
      });
      setImagePreviews([]);
    } catch (err: any) {
      console.error("Error creating product:", err);
      setError(
        err.response?.data?.message || "Erreur lors de la création du produit"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================== RENDER ====================
  return (
    <div className="product-create-page">
      <div className="page-header">
        <h1>📱 Créer un nouveau produit</h1>
        <p>Ajoutez un nouveau produit à votre catalogue</p>
      </div>

      {error && (
        <div className="alert alert-error">
          <span className="alert-icon">❌</span>
          {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <span className="alert-icon">✅</span>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-form-create">
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
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: iPhone 15 Pro Max"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="slug">
                Slug (URL) <span className="required">*</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="iphone-15-pro-max"
                required
              />
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
              value={formData.description}
              onChange={handleChange}
              placeholder="Décrivez votre produit en détail..."
              rows={5}
              required
            />
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
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez une catégorie</option>
                {/* {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))} */}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="sub">Sous-catégorie</label>
              <select
                id="sub"
                name="sub"
                value={formData.sub}
                onChange={handleChange}
                disabled={!formData.category}
              >
                <option value="">Sélectionnez une sous-catégorie</option>
                {filteredSubs.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
              {!formData.category && (
                <small className="form-hint">
                  Sélectionnez d'abord une catégorie
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
                value={formData.brand}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez une marque</option>
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="color">
                Couleur <span className="required">*</span>
              </label>
              <select
                id="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez une couleur</option>
                {colors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
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
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">
                Quantité en stock <span className="required">*</span>
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="shipping">Livraison</label>
              <select
                id="shipping"
                name="shipping"
                value={formData.shipping}
                onChange={handleChange}
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
                accept="image/*"
                multiple
                style={{ display: "none" }}
              />
            </div>

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
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ACTIONS */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => window.history.back()}
          >
            Annuler
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
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

export default AdminProductCreatePage;
