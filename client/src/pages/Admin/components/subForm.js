import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const SubForm = ({
  onSubmit,
  onCancel,
  initialData = null,
  categories = [],
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    parent: "",
  });

  // Initialiser le formulaire avec les données existantes (pour l'édition)
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        slug: initialData.slug || "",
        parent: initialData.parent?._id || initialData.parent || "",
      });
    }
  }, [initialData]);

  // Générer le slug à partir du nom
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim("-");
  };

  // Gestionnaire de changement de champ
  const handleFieldChange = (field, value) => {
    console.log("🔍 Changement de champ:", field, value);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Générer automatiquement le slug si le nom change
    if (field === "name") {
      setFormData((prev) => ({
        ...prev,
        name: value,
        slug: generateSlug(value),
      }));
    }
  };

  // Soumettre le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.slug || !formData.parent) {
      return; // La validation sera gérée par le parent
    }

    // Validation côté client pour éviter les doublons évidents
    if (formData.name.trim().length < 3) {
      return; // La validation sera gérée par le parent
    }

    if (formData.slug.trim().length < 3) {
      return; // La validation sera gérée par le parent
    }

    onSubmit(formData);
  };

  // Réinitialiser le formulaire
  const handleReset = () => {
    setFormData({
      name: "",
      slug: "",
      parent: "",
    });
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">
        {initialData
          ? "Modifier la sous-catégorie"
          : "Créer une nouvelle sous-catégorie"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom de la sous-catégorie *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleFieldChange("name", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nom de la sous-catégorie"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug *
          </label>
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => handleFieldChange("slug", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="slug-de-la-sous-categorie"
            required
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            Le slug est généré automatiquement à partir du nom
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie parente *
          </label>
          <select
            value={formData.parent}
            onChange={(e) => handleFieldChange("parent", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={loading}
          >
            <option value="">Sélectionner une catégorie</option>
            {categories &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
          {(!categories || categories.length === 0) && (
            <p className="text-xs text-red-500 mt-1">
              Aucune catégorie disponible. Créez d'abord des catégories.
            </p>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading || !categories || categories.length === 0}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
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
            ) : initialData ? (
              "Mettre à jour"
            ) : (
              "Créer"
            )}
          </button>

          {initialData && (
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

SubForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  initialData: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    slug: PropTypes.string,
    parent: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
      }),
    ]),
  }),
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      slug: PropTypes.string,
    })
  ).isRequired,
  loading: PropTypes.bool,
};

export default SubForm;
