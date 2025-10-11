import type { FormikErrors } from "formik";

interface FormikHelpers<Values> {
  setSubmitting: (isSubmitting: boolean) => void; // Indicateur de chargement
  setErrors: (errors: FormikErrors<Values>) => void; // Définir des erreurs
  setFieldError: (field: string, message: string) => void; // Erreur sur un champ
  setFieldValue: (field: string, value: any) => void; // Changer une valeur
  setFieldTouched: (field: string, touched?: boolean) => void; // Marquer comme touché
  resetForm: () => void; // Réinitialiser le formulaire
  setStatus: (status?: any) => void; // Définir un statut personnalisé
  validateForm: () => Promise<FormikErrors<Values>>; // Valider manuellement
}
export type { FormikHelpers };
