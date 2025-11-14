// src/validators/validationCreateProduct.ts
import * as Yup from "yup";

/**
 * Validation schema for product creation form
 */
export const productValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(100, "Le titre ne doit pas dépasser 100 caractères")
    .required("Le titre est requis"),

  slug: Yup.string()
    .min(3, "Le slug doit contenir au moins 3 caractères")
    .max(120, "Le slug ne doit pas dépasser 120 caractères")
    .matches(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets"
    )
    .required("Le slug est requis"),

  price: Yup.number()
    .min(0.01, "Le prix doit être supérieur à 0")
    .max(1000000, "Le prix ne peut pas dépasser 1 000 000")
    .required("Le prix est requis")
    .typeError("Le prix doit être un nombre"),

  description: Yup.string()
    .min(10, "La description doit contenir au moins 10 caractères")
    .max(2000, "La description ne doit pas dépasser 2000 caractères")
    .required("La description est requise"),

  category: Yup.string()
    .required("La catégorie est requise")
    .test(
      "is-valid-id",
      "ID de catégorie invalide",
      (value) => !value || /^[a-f\d]{24}$/i.test(value)
    ),

  sub: Yup.string()
    .optional()
    .nullable()
    .test(
      "is-valid-id",
      "ID de sous-catégorie invalide",
      (value) => !value || /^[a-f\d]{24}$/i.test(value)
    ),

  quantity: Yup.number()
    .min(0, "La quantité ne peut pas être négative")
    .max(100000, "La quantité ne peut pas dépasser 100 000")
    .integer("La quantité doit être un nombre entier")
    .required("La quantité est requise")
    .typeError("La quantité doit être un nombre"),

  shipping: Yup.string()
    .oneOf(["Yes", "No"], "La livraison doit être Yes ou No")
    .required("La livraison est requise"),

  color: Yup.string()
    .oneOf(
      [
        "Black",
        "White",
        "Silver",
        "Gold",
        "Yellow",
        "Blue",
        "Red",
        "Green",
        "Purple",
        "Brown",
        "Gray",
      ],
      "Couleur invalide"
    )
    .required("La couleur est requise"),

  brand: Yup.string()
    .oneOf(
      [
        "Apple",
        "Samsung",
        "Xiaomi",
        "Huawei",
        "OnePlus",
        "Google",
        "Oppo",
        "Vivo",
        "Realme",
        "Motorola",
        "Sony",
        "Nokia",
        "Transsion",
        "Autre",
      ],
      "Marque invalide"
    )
    .required("La marque est requise"),

  images: Yup.array()
    .of(
      Yup.mixed<File>()
        .test("fileSize", "Chaque image ne doit pas dépasser 5MB", (value) => {
          if (!value) return true;
          return (value as File).size <= 5 * 1024 * 1024;
        })
        .test(
          "fileType",
          "Seules les images sont autorisées (JPEG, PNG, GIF, WebP)",
          (value) => {
            if (!value) return true;
            return [
              "image/jpeg",
              "image/jpg",
              "image/png",
              "image/gif",
              "image/webp",
            ].includes((value as File).type);
          }
        )
    )
    .max(5, "Maximum 5 images autorisées")
    .optional(),
});

export type ProductFormValues = Yup.InferType<typeof productValidationSchema>;
