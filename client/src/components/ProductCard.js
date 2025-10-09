import React from "react";
import PropTypes from "prop-types";
import { isProductImage } from "../utils/getImageProductList";

const ProductCard = ({
  product,
  onViewDetails,
  onAddToCart,
  showAdminActions = false,
  onEdit,
  onDelete,
}) => {
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(product);
    }
  };
  // console.log(
  //   `produit venant du back : ${process.env.REACT_APP_API}${product.images[0]}`
  // );

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const handleEdit = () => {
    // si on reçoit la prop onEdit, on appelle la fonction onEdit avec le produit lorsque l'utilisateur clique sur le bouton "Modifier"
    if (onEdit) {
      onEdit(product);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(product);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image */}
      <div className="relative">
        {console.log(
          `Image du produit : ${process.env.REACT_APP_API}${product.images}`
        )}
        {product.images && product.images.length > 0 ? (
          <img
            src={
              isProductImage(product)?.[0] ||
              `${process.env.REACT_APP_API}${product.images[0]}`
            }
            alt={product.name || "Image produit"}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">Aucune image</span>
          </div>
        )}

        {/* Badge de stock */}
        {product.quantity <= 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Out of stock
          </div>
        )}

        {/* Badge de promotion (optionnel) */}
        {product.sold > 10 && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Popular
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {product.title}
        </h3>

        <p className="text-2xl font-bold text-blue-600 mb-2">
          {product.price} €
        </p>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* Informations supplémentaires */}
        <div className="space-y-1 text-sm text-gray-500 mb-4">
          {product.category && <p>Category: {product.category.name}</p>}
          {product.sub && <p>Subcategory: {product.sub.name}</p>}
          {product.brand && <p>Brand: {product.brand}</p>}
          {product.color && <p>Color: {product.color}</p>}
          <p>Stock: {product.quantity || 0}</p>
          {product.shipping && (
            <p>
              Delivery:{" "}
              {product.shipping === "Yes" ? "Included" : "Not included"}
            </p>
          )}
        </div>

        {/* Boutons d'action */}
        <div className="flex space-x-2">
          {showAdminActions ? (
            // Actions admin
            <>
              <button
                onClick={handleViewDetails}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium shadow-md"
              >
                Voir plus
              </button>
              <button
                onClick={handleEdit}
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-2 px-4 rounded-lg hover:from-yellow-500 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 shadow-md transform hover:scale-105"
                title="Modifier le produit"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className="bg-gradient-to-r from-red-500 to-pink-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 shadow-md transform hover:scale-105"
                title="Supprimer le produit"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </>
          ) : (
            // Actions utilisateur
            <>
              <button
                onClick={handleViewDetails}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 font-medium shadow-md"
                disabled={product.quantity <= 0}
              >
                Voir détails
              </button>
              <button
                onClick={handleAddToCart}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 px-4 rounded-lg hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                disabled={product.quantity <= 0}
                title={
                  product.quantity <= 0
                    ? "Produit en rupture de stock"
                    : "Ajouter au panier"
                }
              >
                <svg
                  className="w-5 h-5"
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
              </button>
            </>
          )}
        </div>

        {/* Informations supplémentaires en bas */}
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Sold: {product.sold || 0}</span>
            <span>ID: {product._id?.slice(-6)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    description: PropTypes.string,
    images: PropTypes.array,
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
    sold: PropTypes.number,
    brand: PropTypes.string,
    color: PropTypes.string,
    shipping: PropTypes.string,
    createdAt: PropTypes.string,
  }).isRequired,
  onViewDetails: PropTypes.func,
  onAddToCart: PropTypes.func,
  showAdminActions: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default ProductCard;
