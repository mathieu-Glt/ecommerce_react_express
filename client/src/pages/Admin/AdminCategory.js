import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CategoryForm from "./components/categoryForm";
import useToast from "../../hooks/useToast";
import {
  fetchCategories,
  createNewCategory,
  updateExistingCategory,
  deleteExistingCategory,
} from "../../actions/categoryActions";

function AdminCategory() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, loading, error } = useSelector((state) => state.category);

  const [editingCategory, setEditingCategory] = useState(null);
  const {
    showSuccess,
    showError,
    showLoading,
    updateToSuccess,
    updateToError,
    crud,
  } = useToast();
  const token = localStorage.getItem("token");

  // Charger les catégories
  useEffect(() => {
    const loadCategories = async (token) => {
      try {
        await dispatch(fetchCategories(token));
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    if (token) {
      loadCategories();
    }
  }, [dispatch, token]);

  // Ajouter une nouvelle catégorie
  const handleCreate = async (categoryData) => {
    const loadingToast = showLoading("Creating category...");
    try {
      await dispatch(createNewCategory(categoryData, token));
      updateToSuccess(loadingToast, crud.createSuccess("Category"));
      // Recharger la liste des catégories
      dispatch(fetchCategories(token));
    } catch (err) {
      updateToError(loadingToast, crud.createError("Category"));
      console.error("Error creating category:", err);
    }
  };

  // Mettre à jour une catégorie
  const handleUpdate = async (categoryData) => {
    if (!editingCategory) return;

    const loadingToast = showLoading("Updating category...");
    try {
      await dispatch(
        updateExistingCategory(editingCategory._id, categoryData, token)
      );
      updateToSuccess(loadingToast, crud.updateSuccess("Category"));
      setEditingCategory(null);
      // Recharger la liste des catégories
      dispatch(fetchCategories(token));
    } catch (err) {
      updateToError(loadingToast, crud.updateError("Category"));
      console.error("Error updating category:", err);
    }
  };

  // Supprimer une catégorie
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    const loadingToast = showLoading("Deleting category...");
    try {
      await dispatch(deleteExistingCategory(id, token));
      updateToSuccess(loadingToast, crud.deleteSuccess("Category"));
      // Recharger la liste des catégories
      dispatch(fetchCategories(token));
    } catch (err) {
      updateToError(loadingToast, crud.deleteError("Category"));
      console.error("Error deleting category:", err);
    }
  };

  // Rediriger vers la page d'édition
  const handleEditCategory = (category) => {
    navigate(`/admin/category/edit/${category._id}`);
  };

  console.log("État des catégories:", {
    categories,
    loading,
    error,
    categoriesLength: categories ? categories.length : 0,
    categoriesType: typeof categories,
    isArray: Array.isArray(categories),
  });

  return (
    <div className="container mt-4">
      <h1>Category Management</h1>

      <div className="mb-4">
        <h3>{editingCategory ? "Edit Category" : "Add New Category"}</h3>
        <CategoryForm
          onSubmit={editingCategory ? handleUpdate : handleCreate}
          initialData={editingCategory || { name: "" }}
          submitLabel={editingCategory ? "Update" : "Create"}
        />
      </div>

      <h3>Existing Categories</h3>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : !categories || categories.length === 0 ? (
        <p>No categories found</p>
      ) : (
        <ul className="list-group">
          {categories.map((cat) => (
            <li
              key={cat._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {cat.name}
              <div>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEditCategory(cat)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(cat._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AdminCategory;
