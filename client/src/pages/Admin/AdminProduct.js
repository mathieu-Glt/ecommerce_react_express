import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getCategories } from "../../api/category";
import { getSubs } from "../../api/sub";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../api/product";
import useToast from "../../hooks/useToast";
import ProductForm from "./components/productForm";
import ProductCard from "../../components/ProductCard";
import { validationProductSchema } from "../../validator/validationCreateProduct";

// Fonction pour récupérer le token de session
const getSessionToken = () => {
  return sessionStorage.getItem("token") || localStorage.getItem("token");
};

const AdminProduct = () => {
  const { user } = useSelector((state) => state.user);
  const sessionToken = getSessionToken();
  const {
    showSuccess,
    showError,
    showLoading,
    updateToSuccess,
    updateToError,
    dismissAll,
  } = useToast();

  console.log("User connected:", user);
  console.log("ession token present:", !!sessionToken);
  console.log(
    "Session token value:",
    sessionToken ? sessionToken.substring(0, 20) + "..." : "No token"
  );
  console.log(
    "État Redux complet:",
    useSelector((state) => state)
  );

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [errors, setErrors] = useState({});

  // Charger les données
  useEffect(() => {
    if (sessionToken) {
      console.log(" useEffect triggered - data loading");
      loadData();
    }
  }, [sessionToken]);

  const loadData = async () => {
    console.log(" Data loading started");
    setLoading(true);
    try {
      console.log(
        " Data loading with token:",
        sessionToken ? "Token present" : "Token missing"
      );

      const [categoriesRes, subsRes, productsRes] = await Promise.all([
        getCategories(sessionToken),
        getSubs(sessionToken),
        getProducts(sessionToken),
      ]);

      console.log("Categories response:", categoriesRes);
      console.log("Subcategories response:", subsRes);
      console.log("Products response:", productsRes);

      // Debug détaillé des sous-catégories
      console.log("🔍 Debug subsRes:", {
        type: typeof subsRes,
        isArray: Array.isArray(subsRes),
        length: subsRes?.length,
        data: subsRes,
      });

      // S'assurer que les données sont des tableaux
      const categoriesData = categoriesRes || [];
      const subsData = subsRes || [];
      const productsData = productsRes || [];

      console.log(" Categories to set:", categoriesData);
      console.log(" Subcategories to set:", subsData);
      console.log(" Products to set:", productsData);

      // Debug: Vérifier la structure des sous-catégories
      if (subsData.length > 0) {
        console.log("Structure de la première sous-catégorie:", subsData[0]);
        console.log("Type de parent:", typeof subsData[0].parent);
        console.log(
          "Parent est un objet:",
          typeof subsData[0].parent === "object"
        );
        console.log("Toutes les sous-catégories:", subsData);
      } else {
        console.log("Aucune sous-catégorie récupérée depuis l'API");
      }

      setCategories(categoriesData);
      setSubs(subsData);
      setProducts(productsData);
      console.log("Data loading completed");
    } catch (error) {
      showError("Error loading data");
      console.error("Error loading data:", error);
      // En cas d'erreur, initialiser avec des tableaux vides
      setCategories([]);
      setSubs([]);
      setProducts([]);
    } finally {
      setLoading(false);
      console.log("Loading state set to false");
    }
  };

  // Soumettre le formulaire
  const handleFormSubmit = async (formData) => {
    if (
      !formData.title ||
      !formData.slug ||
      !formData.price ||
      !formData.description ||
      !formData.category ||
      !formData.sub
    ) {
      showError("All fields are required");
      return;
    }

    // Nettoyer les toasts existants
    // dismissAll();

    const loadingToast = showLoading(
      editingProduct ? "Updating..." : "Creating..."
    );

    try {
      await validationProductSchema.validate(formData, { abortEarly: false });
      setErrors({});

      console.log(
        editingProduct ? "Updating product..." : "Creating product..."
      );
      console.log("Form data to submit:", formData);
      // Préparer les données pour l'envoi
      const submitData = new FormData();

      console.log("formData reçu:", formData);

      // Ajouter les champs texte - Approche alternative
      console.log("formData reçu:", formData);
      console.log(" Clés disponibles dans formData:", Object.keys(formData));
      console.log(" Type de formData:", typeof formData);
      console.log(" formData est un objet:", typeof formData === "object");

      // Ajouter manuellement chaque champ
      const fieldsToAdd = [
        "title",
        "slug",
        "price",
        "description",
        "category",
        "sub",
        "quantity",
        "shipping",
        "color",
        "brand",
      ];

      fieldsToAdd.forEach((field) => {
        if (formData[field] !== undefined) {
          const value = formData[field];
          console.log(
            `Ajout manuel: ${field} = ${value} (type: ${typeof value})`
          );
          submitData.append(field, value);
          console.log(` Ajouté au FormData: ${field} = ${value}`);
        } else {
          console.log(` Champ manquant: ${field}`);
        }
      });

      // Ajouter les images
      if (formData.images && formData.images.length > 0) {
        console.log(" Images à ajouter:", formData.images);
        formData.images.forEach((image, index) => {
          console.log(` Ajout de l'image ${index}:`, image);
          submitData.append("images", image);
        });
      } else {
        console.log(" Aucune image à ajouter");
      }

      // Debug: Vérifier le contenu du FormData
      console.log(" Contenu du FormData:");
      for (let [key, value] of submitData.entries()) {
        console.log(`  ${key}: ${value}`);
      }

      // Alternative: Essayer avec JSON pour debug
      const jsonData = {
        title: formData.title,
        slug: formData.slug,
        price: formData.price,
        description: formData.description,
        category: formData.category,
        sub: formData.sub,
        quantity: formData.quantity,
        shipping: formData.shipping,
        color: formData.color,
        brand: formData.brand,
      };
      console.log(" JSON Data pour debug:", jsonData);

      if (editingProduct) {
        await updateProduct(editingProduct._id, submitData, sessionToken);
        updateToSuccess(loadingToast, "Product updated successfully");
      } else {
        // Utiliser FormData pour supporter les images
        await createProduct(submitData, sessionToken);
        updateToSuccess(loadingToast, "Product created successfully");
      }

      setEditingProduct(null);
      await loadData(); // Attendre que loadData se termine
    } catch (error) {
      if (!error.inner) return;
      console.error("Unexpected error:", error);
      updateToError(loadingToast, "An unexpected error occurred");
      const validationError = error;
      console.log("Validation errors:", validationError);
      // Formater les erreurs pour un accès facile
      const formattedErrors = {};
      error.inner.forEach((err) => {
        formattedErrors[err.path] = err.message;
      });
      setErrors(formattedErrors);
      return;
    }
  };

  // Annuler l'édition
  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  // Gestionnaires pour ProductCard
  const handleViewDetails = (product) => {
    // TODO: Naviguer vers la page de détails du produit
    console.log("View details of the product:", product);
  };

  // Éditer un produit
  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  // Supprimer un produit
  const handleDelete = async (product) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    // Nettoyer les toasts existants
    dismissAll();

    const loadingToast = showLoading("Deletion...");

    try {
      await deleteProduct(product._id, sessionToken);
      updateToSuccess(loadingToast, "Product deleted successfully");
      await loadData(); // Attendre que loadData se termine
    } catch (error) {
      updateToError(loadingToast, "Error deleting product");
      console.error("Error deleting product:", error);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Product Management</h1>

      {/* Formulaire */}
      <ProductForm
        errors={errors}
        onSubmit={handleFormSubmit}
        onCancel={handleCancelEdit}
        initialData={editingProduct}
        categories={categories}
        subs={subs}
        loading={loading}
      />

      {/* Liste des produits */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Produits existants</h2>

        {!products || products.length === 0 ? (
          <p className="text-gray-500">Aucun produit trouvé</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              // Optimiser les images pour l'affichage admin

              return (
                <ProductCard
                  key={product._id}
                  product={product}
                  onViewDetails={handleViewDetails}
                  onEdit={handleEditProduct}
                  onDelete={handleDelete}
                  showAdminActions={true}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProduct;
