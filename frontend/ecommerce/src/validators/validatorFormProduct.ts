// src/validators/validationCreateProduct.ts
import * as Yup from "yup";

/**
 * Validation schema for product creation form
 */
export const productValidationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "The title must contain at least 3 characters")
    .max(100, "The title must not exceed 100 characters")
    .required("The title is required"),

  slug: Yup.string()
    .min(3, "The slug must contain at least 3 characters")
    .max(120, "The slug must not exceed 120 characters")
    .matches(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "The slug can only contain lowercase letters, numbers, and hyphens"
    )
    .required("The slug is required"),

  price: Yup.number()
    .min(0.01, "The price must be greater than 0")
    .max(1000000, "The price must not exceed 1,000,000")
    .required("The price is required")
    .typeError("The price must be a number"),

  description: Yup.string()
    .min(10, "The description must contain at least 10 characters")
    .max(2000, "The description must not exceed 2000 characters")
    .required("The description is required"),

  category: Yup.string()
    .required("The category is required")
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
    .min(0, "The quantity cannot be negative")
    .max(100000, "The quantity must not exceed 100,000")
    .integer("The quantity must be an integer")
    .required("The quantity is required")
    .typeError("The quantity must be a number"),
  shipping: Yup.string()
    .oneOf(["Yes", "No"], "Shipping must be Yes or No")
    .required("Shipping is required"),

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
      "Invalid color"
    )
    .required("Color is required"),

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
      "Invalid brand"
    )
    .required("Brand is required"),

  images: Yup.array()
    .of(
      Yup.mixed<File>()
        .test("fileSize", "Each image must not exceed 5MB", (value) => {
          if (!value) return true;
          return (value as File).size <= 5 * 1024 * 1024;
        })
        .test(
          "fileType",
          "Only images are allowed (JPEG, PNG, GIF, WebP)",
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
    .max(5, "Maximum 5 images allowed")
    .optional(),
});

export type ProductFormValues = Yup.InferType<typeof productValidationSchema>;
