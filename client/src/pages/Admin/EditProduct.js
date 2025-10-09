import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ProductForm from "./components/productForm";
import { getProductById, updateProduct } from "../../api";
import { getCategories } from "../../api/category";
import { getSubs } from "../../api/sub";
import useToast from "../../hooks/useToast";

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.user);
  const { showError, showSuccess } = useToast();

  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est admin
    if (!user || user.role !== "admin") {
      showError("Accès non autorisé");
      navigate("/");
      return;
    }

    loadData();
  }, [productId, user]);

  const loadData = async () => {
    try {
      setLoading(true);
      console.log("Chargement des données avec ID:", productId);
      console.log("Token:", token ? "Présent" : "Manquant");

      // Charger le produit, les catégories et sous-catégories en parallèle
      const [productData, categoriesData, subsData] = await Promise.all([
        getProductById(productId, token),
        getCategories(token),
        getSubs(token),
      ]);

      console.log("Produit récupéré:", productData);
      console.log("Catégories récupérées:", categoriesData);
      console.log("Sous-catégories récupérées:", subsData);

      setProduct(productData);
      setCategories(categoriesData || []);
      setSubs(subsData || []);
    } catch (error) {
      console.error(" Erreur lors du chargement des données:", error);
      console.error(" Détails de l'erreur:", error.response?.data);
      showError("Erreur lors du chargement des données");
      navigate("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  const handleProductUpdated = async (updatedData) => {
    try {
      setSubmitting(true);
      console.log(" Mise à jour du produit avec ID:", productId);
      console.log(" Données à mettre à jour:", updatedData);

      await updateProduct(productId, updatedData, token);

      showSuccess("Produit mis à jour avec succès");
      navigate("/admin/products");
    } catch (error) {
      console.error(" Erreur lors de la mise à jour:", error);
      console.error(" Détails de l'erreur:", error.response?.data);
      showError("Erreur lors de la mise à jour du produit");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/products");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">
            Chargement du produit...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Produit non trouvé
          </h3>
          <p className="text-gray-500 mb-6">
            Le produit que vous recherchez n'existe pas ou a été supprimé.
          </p>
          <button
            onClick={() => navigate("/admin/products")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            Retour aux produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Modifier le produit
              </h1>
              <p className="text-gray-600">
                Modifiez les informations du produit "{product.title}"
              </p>
            </div>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200"
            >
              Annuler
            </button>
          </div>
        </div>

        {/* Formulaire d'édition */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <ProductForm
            initialData={product}
            onSubmit={handleProductUpdated}
            onCancel={handleCancel}
            categories={categories}
            subs={subs}
            loading={submitting}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
