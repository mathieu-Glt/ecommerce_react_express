import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getProducts, deleteProduct } from "../api/product";
import { getCategories } from "../api/category";
import { getSubs } from "../api/sub";
import useToast from "../hooks/useToast";
import ProductCard from "../components/ProductCard";
import { addToCart } from "../actions/cartActions";
import { isProductImage } from "../utils/getImageProductList";
const Products = () => {
  const { user, token } = useSelector((state) => state.user);
  const { showError, showSuccess } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  console.log("Produits chargés:", products[0]);
  // console.log("Produit chargé:", products[0].images[0]);

  isProductImage(products[0]);
  console.log(
    "isProductImage(products[0]) :: ",
    isProductImage(products[0])[0]
  );

  // Filtres
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSub, setSelectedSub] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);

  // Charger les données
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, subsRes] = await Promise.all([
        getProducts(),
        getCategories(),
        getSubs(),
      ]);

      setProducts(productsRes || []);
      setCategories(categoriesRes || []);
      setSubs(subsRes || []);
      setFilteredProducts(productsRes || []);
    } catch (error) {
      showError("Erreur lors du chargement des produits");
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Appliquer les filtres
  useEffect(() => {
    let filtered = [...products];

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtre par catégorie
    if (selectedCategory) {
      filtered = filtered.filter(
        (product) =>
          product.category?._id === selectedCategory ||
          product.category === selectedCategory
      );
    }

    // Filtre par sous-catégorie
    if (selectedSub) {
      filtered = filtered.filter(
        (product) =>
          product.sub?._id === selectedSub || product.sub === selectedSub
      );
    }

    // Filtre par prix
    if (priceRange.min !== "") {
      filtered = filtered.filter(
        (product) => product.price >= parseFloat(priceRange.min)
      );
    }
    if (priceRange.max !== "") {
      filtered = filtered.filter(
        (product) => product.price <= parseFloat(priceRange.max)
      );
    }

    // Filtre par marque
    if (selectedBrand) {
      filtered = filtered.filter((product) => product.brand === selectedBrand);
    }

    // Filtre par couleur
    if (selectedColor) {
      filtered = filtered.filter((product) => product.color === selectedColor);
    }

    // Tri
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset à la première page quand les filtres changent
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedSub,
    priceRange,
    selectedBrand,
    selectedColor,
    sortBy,
  ]);

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Réinitialiser les filtres
  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedSub("");
    setPriceRange({ min: "", max: "" });
    setSelectedBrand("");
    setSelectedColor("");
    setSortBy("newest");
  };

  // Obtenir les sous-catégories disponibles pour la catégorie sélectionnée
  const getAvailableSubs = () => {
    if (!selectedCategory) return [];
    return subs.filter((sub) => sub.parent === selectedCategory);
  };

  // Obtenir les marques uniques
  const getUniqueBrands = () => {
    const brands = products.map((product) => product.brand).filter(Boolean);
    return [...new Set(brands)];
  };

  // Obtenir les couleurs uniques
  const getUniqueColors = () => {
    const colors = products.map((product) => product.color).filter(Boolean);
    return [...new Set(colors)];
  };

  // Gestionnaires d'événements
  const handleViewDetails = (product) => {
    navigate(`/product/${product.slug}`);
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product, 1));
    showSuccess(`${product.title} ajouté au panier`);
    console.log("Ajouter au panier:", product);
  };

  const handleEditProduct = (product) => {
    // Rediriger vers la page d'édition du produit
    navigate(`/admin/product/edit/${product._id}`);
  };

  const handleDeleteProduct = async (product) => {
    if (
      window.confirm(`Êtes-vous sûr de vouloir supprimer "${product.title}" ?`)
    ) {
      try {
        await deleteProduct(product._id, token);
        showSuccess(`Produit "${product.title}" supprimé avec succès`);
        loadData(); // Recharger les données après suppression
      } catch (error) {
        showError("Erreur lors de la suppression du produit");
        console.error("Error deleting product:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Nos Produits</h1>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Recherche */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rechercher
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catégorie
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSub(""); // Reset sous-catégorie
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sous-catégorie */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sous-catégorie
            </label>
            <select
              value={selectedSub}
              onChange={(e) => setSelectedSub(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!selectedCategory}
            >
              <option value="">Toutes les sous-catégories</option>
              {getAvailableSubs().map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tri */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trier par
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="newest">Plus récents</option>
              <option value="price-low">Prix croissant</option>
              <option value="price-high">Prix décroissant</option>
              <option value="name">Nom A-Z</option>
            </select>
          </div>
        </div>

        {/* Filtres avancés */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          {/* Prix */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix min
            </label>
            <input
              type="number"
              value={priceRange.min}
              onChange={(e) =>
                setPriceRange((prev) => ({ ...prev, min: e.target.value }))
              }
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prix max
            </label>
            <input
              type="number"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange((prev) => ({ ...prev, max: e.target.value }))
              }
              placeholder="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Marque */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marque
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les marques</option>
              {getUniqueBrands().map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          {/* Couleur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleur
            </label>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les couleurs</option>
              {getUniqueColors().map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Bouton réinitialiser */}
        <div className="mt-4">
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </div>

      {/* Résultats */}
      <div className="mb-4">
        <p className="text-gray-600">
          {filteredProducts.length} produit
          {filteredProducts.length !== 1 ? "s" : ""} trouvé
          {filteredProducts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Grille des produits */}
      {currentProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Aucun produit trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentProducts.map((product) => {
            // Optimiser les images pour l'affichage des produits
            const optimizedProduct = {
              ...product,
              images:
                product.images?.map((img) => {
                  return img;
                }) || [],
            };

            return (
              <ProductCard
                key={product._id}
                product={product}
                onViewDetails={handleViewDetails}
                onAddToCart={handleAddToCart}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                showAdminActions={user && user.role === "admin"}
              />
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Précédent
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 border rounded-md ${
                  currentPage === page
                    ? "bg-blue-600 text-white border-blue-600"
                    : "border-gray-300 text-gray-500 hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Suivant
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Products;
