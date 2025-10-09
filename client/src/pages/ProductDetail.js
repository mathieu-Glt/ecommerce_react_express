import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getProductBySlug } from "../api/product";
import useToast from "../hooks/useToast";
import { addToCart } from "../actions/cartActions";

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.user);
  const { showError, showSuccess } = useToast();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const productData = await getProductBySlug(slug);
      setProduct(productData);
      console.log("Produit chargé:", productData);
    } catch (error) {
      showError("Erreur lors du chargement du produit");
      console.error("Error loading product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product.quantity <= 0) {
      showError("Produit en rupture de stock");
      return;
    }

    if (quantity > product.quantity) {
      showError(`Quantité disponible: ${product.quantity}`);
      return;
    }

    dispatch(addToCart(product, quantity));
    showSuccess(`${quantity} x ${product.title} ajouté au panier`);
    console.log("Ajouter au panier:", { product, quantity });
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.quantity) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Produit non trouvé
          </h1>
          <p className="text-gray-600 mb-4">
            Le produit que vous recherchez n'existe pas.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Retour aux produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Images */}
          <div>
            {/* Image principale */}
            <div className="mb-4">
              {product.images && product.images.length > 0 ? (
                <img
                  src={`${process.env.REACT_APP_API}/uploads/${product.images[selectedImage]}`}
                  alt={product.title}
                  className="w-full h-96 object-cover rounded-lg"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-lg">Aucune image</span>
                </div>
              )}
            </div>

            {/* Miniatures */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-full h-20 rounded-lg overflow-hidden border-2 ${
                      selectedImage === index
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                  >
                    <img
                      src={`${process.env.REACT_APP_API}/uploads/${image}`}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informations produit */}
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {product.title}
            </h1>

            <div className="text-3xl font-bold text-blue-600 mb-6">
              {product.price} €
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {/* Informations détaillées */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                {product.category && (
                  <div>
                    <span className="font-semibold text-gray-700">
                      Catégorie:
                    </span>
                    <span className="ml-2 text-gray-600">
                      {product.category.name}
                    </span>
                  </div>
                )}
                {product.sub && (
                  <div>
                    <span className="font-semibold text-gray-700">
                      Sous-catégorie:
                    </span>
                    <span className="ml-2 text-gray-600">
                      {product.sub.name}
                    </span>
                  </div>
                )}
                {product.brand && (
                  <div>
                    <span className="font-semibold text-gray-700">Marque:</span>
                    <span className="ml-2 text-gray-600">{product.brand}</span>
                  </div>
                )}
                {product.color && (
                  <div>
                    <span className="font-semibold text-gray-700">
                      Couleur:
                    </span>
                    <span className="ml-2 text-gray-600">{product.color}</span>
                  </div>
                )}
                <div>
                  <span className="font-semibold text-gray-700">Stock:</span>
                  <span
                    className={`ml-2 ${
                      product.quantity > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {product.quantity > 0
                      ? `${product.quantity} disponible(s)`
                      : "Rupture de stock"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">Vendus:</span>
                  <span className="ml-2 text-gray-600">
                    {product.sold || 0}
                  </span>
                </div>
                {product.shipping && (
                  <div>
                    <span className="font-semibold text-gray-700">
                      Livraison:
                    </span>
                    <span className="ml-2 text-gray-600">
                      {product.shipping === "Yes" ? "Incluse" : "Non incluse"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              {/* Sélection quantité */}
              {product.quantity > 0 && (
                <div className="flex items-center space-x-4">
                  <label className="font-semibold text-gray-700">
                    Quantité:
                  </label>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.quantity}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Boutons d'action */}
              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.quantity <= 0}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    className="w-5 h-5 inline mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                    />
                  </svg>
                  {product.quantity > 0
                    ? "Ajouter au panier"
                    : "Rupture de stock"}
                </button>

                <button
                  onClick={() => navigate("/products")}
                  className="bg-gray-500 text-white py-3 px-6 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
                >
                  Retour
                </button>
              </div>
            </div>

            {/* Informations supplémentaires */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Informations supplémentaires
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  • Produit ajouté le:{" "}
                  {new Date(product.createdAt).toLocaleDateString("fr-FR")}
                </p>
                <p>• ID du produit: {product._id}</p>
                <p>• Slug: {product.slug}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
