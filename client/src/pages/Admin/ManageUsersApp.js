import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ManageUserForm from "./components/manageUserForm";
import { useDispatch, useSelector } from "react-redux";
import useToast from "../../hooks/useToast";
import {
  fetchUsers,
  createNewUser,
  updateExistingUser,
  deleteExistingUser,
} from "../../actions/manageUserActions";

function ManageUsersApp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, error } = useSelector((state) => state.manageUser);
  const [editingUser, setEditingUser] = useState(null);
  const token = useSelector((state) => state.auth.token);
  const {
    showSuccess,
    showError,
    showLoading,
    updateToSuccess,
    updateToError,
    crud,
  } = useToast();

  console.log(" État des utilisateurs:", {
    users,
    loading,
    error,
    usersLength: users ? users.length : 0,
    usersType: typeof users,
    isArray: Array.isArray(users),
  });

  // Charger les utilisateurs
  useEffect(() => {
    const loadUsers = async () => {
      try {
        await dispatch(fetchUsers(token));
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    loadUsers();
  }, [dispatch, token]);

  // Créer un nouvel utilisateur
  const handleCreate = async (userData) => {
    const loadingToast = showLoading("Creating user...");
    try {
      await dispatch(createNewUser(token, userData));
      updateToSuccess(loadingToast, crud.createSuccess("User"));
      // Recharger la liste des utilisateurs
      dispatch(fetchUsers(token));
    } catch (err) {
      updateToError(loadingToast, crud.createError("User"));
      console.error("Error creating user:", err);
    }
  };

  // Mettre à jour un utilisateur
  const handleUpdate = async (userData) => {
    if (!editingUser) return;

    const loadingToast = showLoading("Updating user...");
    try {
      await dispatch(updateExistingUser(token, editingUser._id, userData));
      updateToSuccess(loadingToast, crud.updateSuccess("User"));
      setEditingUser(null);
      // Recharger la liste des utilisateurs
      dispatch(fetchUsers(token));
    } catch (err) {
      updateToError(loadingToast, crud.updateError("User"));
      console.error("Error updating user:", err);
    }
  };

  // Supprimer un utilisateur
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    const loadingToast = showLoading("Deleting user...");
    try {
      await dispatch(deleteExistingUser(token, id));
      updateToSuccess(loadingToast, crud.deleteSuccess("User"));
      // Recharger la liste des utilisateurs
      dispatch(fetchUsers(token));
    } catch (err) {
      updateToError(loadingToast, crud.deleteError("User"));
      console.error("Error deleting user:", err);
    }
  };

  // Rediriger vers la page d'édition
  const handleEditUser = (user) => {
    navigate(`/admin/user/edit/${user._id}`);
  };

  return (
    <div className="container mt-4">
      <h1>Manage Users</h1>

      <div className="mb-4">
        <h3>{editingUser ? "Edit User" : "Add User"}</h3>
        <ManageUserForm
          onSubmit={editingUser ? handleUpdate : handleCreate}
          initialData={editingUser || {}}
          submitLabel={editingUser ? "Update" : "Create"}
        />
      </div>

      <h3>Existing Users</h3>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : users && users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <ul className="list-group">
          {users &&
            users.map((user) => (
              <li
                key={user._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{user.name || user.firstname || user.email}</strong>
                  <br />
                  <small className="text-muted">
                    {user.email} - {user.role || "User"}
                  </small>
                </div>
                <div>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEditUser(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(user._id)}
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

export default ManageUsersApp;
