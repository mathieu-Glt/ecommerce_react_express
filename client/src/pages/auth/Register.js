import React, { useState } from "react";
import RegisterForm from "../../components/auth/RegisterForm";
import useAuth from "../../hooks/useAuth";
import { validationRegisterSchema } from "../../validator/validationRegister";
import Resizer from "react-image-file-resizer";

const Register = ({ redirectTo = "/" }) => {
  const { loading, register } = useAuth();

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    picture: null,
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  // Convertir un fichier en Base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Soumission avec validation Yup
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validation avec Yup
      await validationRegisterSchema.validate(formData, { abortEarly: false });

      // Convertir l'image si elle existe
      let pictureBase64 = null;
      if (formData.picture) {
        pictureBase64 = await convertFileToBase64(formData.picture);
      }

      const registerData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        picture: pictureBase64,
      };

      await register(registerData, redirectTo);
    } catch (err) {
      if (err.inner) {
        // Récupérer toutes les erreurs Yup
        const formErrors = {};
        err.inner.forEach((error) => {
          formErrors[error.path] = error.message;
        });
        setErrors(formErrors);
      }
    }
  };

  // Gestion changement champ avec nettoyage des erreurs
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  // Validation fichier image (hors Yup car spécifique)
  const handleImageInputChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      const maxSize = 2 * 1024 * 1024; // 2MB

      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          picture:
            "Type de fichier non supporté. Utilisez JPEG, PNG, GIF ou WebP.",
        }));
        return;
      }

      try {
        // Redimensionner l'image avant l'enregistrement
        const resizedImage = await new Promise((resolve) => {
          Resizer.imageFileResizer(
            file,
            800, // largeur max
            800, // hauteur max
            "JPEG", // format
            90, // qualité
            0, // rotation
            (uri) => resolve(uri),
            "file" // sortie sous forme de fichier pour l'envoi
          );
        });

        // Vérification taille max après redimensionnement
        if (resizedImage.size > maxSize) {
          setErrors((prev) => ({
            ...prev,
            picture:
              "L'image est trop volumineuse après compression. Taille maximale : 2MB.",
          }));
          return;
        }

        setFormData((prev) => ({
          ...prev,
          picture: file,
        }));

        setErrors((prev) => ({
          ...prev,
          picture: null,
        }));

        // Prévisualisation
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target.result);
        };
        reader.readAsDataURL(resizedImage);
      } catch (error) {
        console.error("Erreur lors du redimensionnement de l'image :", error);
        setErrors((prev) => ({
          ...prev,
          picture: "Impossible de traiter l'image.",
        }));
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <RegisterForm
        formData={formData}
        errors={errors}
        loading={loading}
        imagePreview={imagePreview}
        onSubmit={handleFormSubmit}
        handleFieldChange={handleFieldChange}
        handleImageInputChange={handleImageInputChange}
      />
    </div>
  );
};

export default Register;
