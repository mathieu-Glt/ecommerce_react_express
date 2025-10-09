import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import ManageUserForm from "./components/manageUserForm";
import { getUserById, updateUser } from "../../api/user";
import useToast from "../../hooks/useToast";

const EditUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.user);
  const { showError, showSuccess } = useToast();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      showError("Accès non autorisé");
      navigate("/");
      return;
    }
    loadUser();
  }, [userId, user]);

  const loadUser = async () => {
    try {
      setLoading(true);
      console.log(" Chargement de l'utilisateur avec ID:", userId);
      console.log(" Token:", token ? "Présent" : "Manquant");

      const userData = await getUserById(token, userId);
      console.log(" Utilisateur récupéré:", userData);

      setUserData(userData);
    } catch (error) {
      console.error(" Erreur lors du chargement de l'utilisateur:", error);
      console.error(" Détails de l'erreur:", error.response?.data);
      showError("Erreur lors du chargement de l'utilisateur");
      navigate("/admin/users");
    } finally {
      setLoading(false);
    }
  };

  const handleUserUpdated = async (updatedData) => {
    try {
      setSubmitting(true);
      console.log(" Mise à jour de l'utilisateur avec ID:", userId);
      console.log(" Données à mettre à jour:", updatedData);

      await updateUser(token, userId, updatedData);

      showSuccess("Utilisateur mis à jour avec succès");
      navigate("/admin/users");
    } catch (error) {
      console.error(" Erreur lors de la mise à jour:", error);
      console.error(" Détails de l'erreur:", error.response?.data);
      showError("Erreur lors de la mise à jour de l'utilisateur");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/users");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            User not found
          </h2>
          <p className="text-gray-600 mb-4">
            The user you are looking for does not exist.
          </p>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          >
            Back to the users list
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Edit user
              </h1>
              <p className="text-gray-600">
                Edit the user's information "{userData.name || userData.email}"
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
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <ManageUserForm
            onSubmit={handleUserUpdated}
            initialData={userData}
            submitLabel="Mettre à jour"
          />
        </div>
      </div>
    </div>
  );
};

export default EditUser;
