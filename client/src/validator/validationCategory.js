import * as Yup from "yup";

export const validationCategorySchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required("Le nom de la catégorie est requis")
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .max(32, "Le nom ne doit pas dépasser 32 caractères"),

  slug: Yup.string()
    .trim()
    .max(150, "Le slug est trop long")
    .nullable()
    .notRequired(),

  subs: Yup.array().of(Yup.string()).nullable().notRequired(),
});
