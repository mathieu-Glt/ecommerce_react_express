import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Resizer from "react-image-file-resizer";

const ProductForm = ({
  onSubmit,
  onCancel,
  errors = {},
  initialData = null,
  categories = [],
  subs = [],
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    price: "",
    description: "",
    category: "",
    sub: "",
    quantity: "",
    shipping: "Yes",
    color: "Black",
    brand: "Apple",
    images: [],
  });

  const [availableSubs, setAvailableSubs] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  // Initialiser le formulaire avec les données existantes (pour l'édition)
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        slug: initialData.slug || "",
        price: initialData.price || "",
        description: initialData.description || "",
        category: initialData.category?._id || initialData.category || "",
        sub: initialData.sub?._id || initialData.sub || "",
        quantity: initialData.quantity || "",
        shipping: initialData.shipping || "Yes",
        color: initialData.color || "Black",
        brand: initialData.brand || "Apple",
        images: initialData.images || [],
      });

      // Charger les images existantes
      if (initialData.images && initialData.images.length > 0) {
        setImagePreview(initialData.images);
      }
    }
  }, [initialData]);

  // Filtrer les sous-catégories quand la catégorie change
  useEffect(() => {
    console.log("🔍 Filtrage des sous-catégories:");
    console.log("📋 Toutes les sous-catégories:", subs);
    console.log("🎯 Catégorie sélectionnée:", formData.category);

    if (formData.category) {
      const filteredSubs = subs.filter((sub) => {
        // sub.parent peut être soit un ObjectId (string) soit un objet populé avec _id
        const parentId =
          typeof sub.parent === "object" ? sub.parent._id : sub.parent;
        const parentMatch = parentId === formData.category;
        console.log(
          `🔍 Sous-catégorie "${sub.name}": parent=${sub.parent}, parentId=${parentId}, category=${formData.category}, match=${parentMatch}`
        );
        return parentMatch;
      });

      console.log("Sous-catégories filtrées:", filteredSubs);
      setAvailableSubs(filteredSubs);

      // Réinitialiser la sous-catégorie si elle n'appartient pas à la nouvelle catégorie
      if (
        formData.sub &&
        !filteredSubs.find((sub) => sub._id === formData.sub)
      ) {
        setFormData((prev) => ({ ...prev, sub: "" }));
      }
    } else {
      console.log("Aucune catégorie sélectionnée");
      setAvailableSubs([]);
      setFormData((prev) => ({ ...prev, sub: "" }));
    }
  }, [formData.category, subs]);

  // Générer le slug à partir du titre
  const generateSlug = (title) => {
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");

    // Ajouter un timestamp pour rendre le slug unique
    const timestamp = Date.now();
    return `${baseSlug}-${timestamp}`;
  };

  // Validation des champs
  // const validateField = (field, value) => {
  //   const newErrors = { ...errors };

  //   switch (field) {
  //     case "title":
  //       if (!value.trim()) {
  //         newErrors.title = "The title is required";
  //       } else if (value.length < 3) {
  //         newErrors.title = "The title must contain at least 3 characters";
  //       } else if (value.length > 32) {
  //         newErrors.title = "The title cannot exceed 32 characters";
  //       } else {
  //         delete newErrors.title;
  //       }
  //       break;

  //     case "price":
  //       if (!value) {
  //         newErrors.price = "The price is required";
  //       } else if (isNaN(value) || parseFloat(value) <= 0) {
  //         newErrors.price = "The price must be a positive number";
  //       } else {
  //         delete newErrors.price;
  //       }
  //       break;

  //     case "description":
  //       if (!value.trim()) {
  //         newErrors.description = "The description is required";
  //       } else if (value.length < 10) {
  //         newErrors.description =
  //           "The description must contain at least 10 characters";
  //       } else if (value.length > 2000) {
  //         newErrors.description =
  //           "The description cannot exceed 2000 characters";
  //       } else {
  //         delete newErrors.description;
  //       }
  //       break;

  //     case "category":
  //       if (!value) {
  //         newErrors.category = "The category is required";
  //       } else {
  //         delete newErrors.category;
  //       }
  //       break;

  //     case "sub":
  //       if (!value) {
  //         newErrors.sub = "The subcategory is required";
  //       } else {
  //         delete newErrors.sub;
  //       }
  //       break;

  //     default:
  //       break;
  //   }

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  // Gestionnaire de changement de champ
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Générer automatiquement le slug si le titre change
    if (field === "title") {
      setFormData((prev) => ({
        ...prev,
        title: value,
        slug: generateSlug(value),
      }));
    }

    // Valider le champ
    // validateField(field, value);
  };

  // Gestionnaire pour les images
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    const resizedImages = [];
    const previews = [];

    for (let file of files) {
      // Vérification du type
      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed");
        continue;
      }

      try {
        const resizedBlob = await new Promise((resolve) => {
          Resizer.imageFileResizer(
            file,
            800, // largeur max
            800, // hauteur max
            "JPEG", // format
            90, // qualité
            0, // rotation
            (uri) => resolve(uri),
            "blob"
          );
        });

        // Vérification taille max 5 Mo après compression
        if (resizedBlob.size > 5 * 1024 * 1024) {
          alert(
            `The file ${file.name} is too large even after compression. Max size is 5MB.`
          );
          continue;
        }

        const previewUrl = URL.createObjectURL(resizedBlob);
        resizedImages.push(resizedBlob);
        previews.push(previewUrl);
      } catch (error) {
        console.error("Error resizing image:", error);
      }
    }

    // Mise à jour des états en dehors de la boucle
    setImageFiles((prev) => [...prev, ...resizedImages]);
    setImagePreview((prev) => [...prev, ...previews]);
  };

  // Supprimer une image
  const removeImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);

    setImageFiles(newFiles);
    setImagePreview(newPreviews);
  };

  // Validation complète du formulaire
  const validateForm = () => {
    const fieldsToValidate = [
      "title",
      "price",
      "description",
      "category",
      "sub",
    ];
    let isValid = true;

    // fieldsToValidate.forEach((field) => {
    //   if (!validateField(field, formData[field])) {
    //     isValid = false;
    //   }
    // });

    return isValid;
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Préparer les données avec les images
    const submitData = {
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity) || 0,
      images: imageFiles, // Les fichiers seront traités côté serveur
    };

    onSubmit(submitData);
  };

  // Réinitialiser le formulaire
  const handleReset = () => {
    setFormData({
      title: "",
      slug: "",
      price: "",
      description: "",
      category: "",
      sub: "",
      quantity: "",
      shipping: "Yes",
      color: "Black",
      brand: "Apple",
      images: [],
    });
    setImageFiles([]);
    setImagePreview([]);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold text-gray-800">
            {initialData ? "Modify the product" : "Create a new product"}
          </h2>
          {/* Badge Cloudinary */}
          <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
            <span className="mr-1">☁️</span>
            Cloudinary Ready
          </div>
        </div>
        <p className="text-gray-600">
          {initialData
            ? "Modify the product information"
            : "Fill in the information to create a new product"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section Informations de base */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            {/* <svg
              className="w-5 h-5 mr-2 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            > */}
            {/* <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg> */}
            Basic information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title of the product
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Ex: iPhone 15 Pro Max"
                required
                disabled={loading}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleFieldChange("slug", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="iphone-15-pro-max"
                required
                disabled={loading}
              />
              {errors.slug && (
                <p className="text-xs text-gray-500 mt-1">
                  The slug is generated automatically from the title
                </p>
              )}
            </div>
          </div>

          {/* Prix et Quantité */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Prix */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (€)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  €
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleFieldChange("price", e.target.value)}
                  className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.price ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="999.99"
                  required
                  disabled={loading}
                />
              </div>
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>

            {/* Quantité */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity in stock
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => handleFieldChange("quantity", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                placeholder="10"
                disabled={loading}
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Detailed description of the product..."
              required
              disabled={loading}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description && (
                <p className="text-red-500 text-sm">{errors.description}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {formData.description.length}/2000 characters
              </p>
            </div>
          </div>
        </div>

        {/* Section Catégorisation */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            {/* <svg
              className="w-5 h-5 mr-2 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg> */}
            Catégorisation
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleFieldChange("category", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
                required
                disabled={loading}
              >
                <option value="">Select a category</option>
                {categories &&
                  categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>

            {/* Sous-catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subcategory
              </label>
              <select
                value={formData.sub}
                onChange={(e) => handleFieldChange("sub", e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.sub ? "border-red-500" : "border-gray-300"
                }`}
                required
                disabled={loading || !formData.category}
              >
                <option value="">
                  {formData.category
                    ? "Select a subcategory"
                    : "Select a category first"}
                </option>
                {availableSubs.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
              {errors.sub && (
                <p className="text-red-500 text-sm mt-1">{errors.sub}</p>
              )}
              {formData.category && availableSubs.length === 0 && (
                <p className="text-xs text-orange-600 mt-1">
                  No subcategory available for this category
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Section Caractéristiques */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            {/* <svg
              className="w-5 h-5 mr-2 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg> */}
            Characteristics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Marque */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <select
                value={formData.brand}
                onChange={(e) => handleFieldChange("brand", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                disabled={loading}
              >
                <option value="Apple">Apple</option>
                <option value="Samsung">Samsung</option>
                <option value="Microsoft">Microsoft</option>
                <option value="Lenovo">Lenovo</option>
                <option value="Asus">Asus</option>
                <option value="Dell">Dell</option>
                <option value="HP">HP</option>
                <option value="Acer">Acer</option>
              </select>
            </div>

            {/* Couleur */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <select
                value={formData.color}
                onChange={(e) => handleFieldChange("color", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                disabled={loading}
              >
                <option value="Black">Black</option>
                <option value="Brown">Brown</option>
                <option value="Silver">Silver</option>
                <option value="Blue">Blue</option>
                <option value="White">White</option>
                <option value="Green">Green</option>
              </select>
            </div>

            {/* Livraison */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Livraison
              </label>
              <select
                value={formData.shipping}
                onChange={(e) => handleFieldChange("shipping", e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                disabled={loading}
              >
                <option value="Yes">Included</option>
                <option value="No">Not included</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section Images */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            {/* <svg
              className="w-5 h-5 mr-2 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg> */}
            Product images
          </h3>

          <div className="space-y-4">
            {/* Upload d'images */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
                disabled={loading}
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                {/* <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg> */}
                <p className="mt-2 text-sm text-gray-600">
                  <span className="font-medium text-blue-600 hover:text-blue-500">
                    Click to download
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG, GIF up to 5MB
                </p>
              </label>
            </div>

            {/* Prévisualisation des images */}
            {imagePreview.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {imagePreview.map((preview, index) => {
                  // Optimiser l'affichage des images Cloudinary
                  return (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        loading="lazy"
                      />
                      {/* Badge Cloudinary pour les images uploadées */}
                      {/* {isCloudinaryImage(preview) && (
                        <div className="absolute top-1 left-1 bg-blue-500 text-white px-1 py-0.5 rounded text-xs opacity-75">
                          ☁️
                        </div>
                      )} */}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        ×
                      </button>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg"></div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Statistiques Cloudinary */}
            {/* <CloudinaryStats images={imagePreview} /> */}
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {initialData ? "Mise à jour..." : "Création..."}
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {initialData ? "Mettre à jour" : "Créer le produit"}
              </span>
            )}
          </button>

          {initialData && (
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Messages d'erreur globaux */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <svg
              className="w-5 h-5 text-red-400 mr-2 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-red-800">
                Please correct the following errors:
              </h3>
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

ProductForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  initialData: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    slug: PropTypes.string,
    price: PropTypes.number,
    description: PropTypes.string,
    category: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
      }),
    ]),
    sub: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
      }),
    ]),
    quantity: PropTypes.number,
    shipping: PropTypes.string,
    color: PropTypes.string,
    brand: PropTypes.string,
    images: PropTypes.array,
  }),
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      slug: PropTypes.string,
    })
  ).isRequired,
  subs: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      slug: PropTypes.string,
      parent: PropTypes.string,
    })
  ).isRequired,
  loading: PropTypes.bool,
};

export default ProductForm;
