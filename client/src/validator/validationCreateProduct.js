import * as Yup from "yup";

export const validationProductSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required("Le titre est requis")
    .max(32, "Le titre ne doit pas dépasser 32 caractères"),

  slug: Yup.string()
    .trim()
    .max(150, "Le slug est trop long")
    .nullable()
    .notRequired(),

  price: Yup.number()
    .typeError("Le prix doit être un nombre")
    .required("Le prix est requis")
    .min(0, "Le prix doit être positif"),

  description: Yup.string()
    .trim()
    .required("La description est requise")
    .max(2000, "La description ne doit pas dépasser 2000 caractères"),

  category: Yup.string().required("La catégorie est requise"),

  sub: Yup.string().required("La sous-catégorie est requise"),

  quantity: Yup.number()
    .typeError("La quantité doit être un nombre entier")
    .integer("La quantité doit être un entier")
    .min(0, "La quantité ne peut pas être négative")
    .nullable()
    .notRequired(),

  shipping: Yup.string()
    .oneOf(["Yes", "No"], "Option d'expédition invalide")
    .required("L'option d'expédition est requise"),

  color: Yup.string()
    .oneOf(
      ["Black", "Brown", "Silver", "Blue", "White", "Green"],
      "Couleur invalide"
    )
    .nullable()
    .notRequired(),

  brand: Yup.string()
    .oneOf(
      ["Apple", "Samsung", "Microsoft", "Lenovo", "Asus", "Dell", "HP", "Acer"],
      "Marque invalide"
    )
    .nullable()
    .notRequired(),
});
