/**
 * Register form data structure
 */
/**
 * Props for LoginForm component
 */
import type { RegisterFormValues } from "../validators/validatorsFormRegister"; // Update the path as needed
export type RegisterApiData = Omit<RegisterFormData, "confirmPassword">;
export type RegiterFormCompleteData = Pick<
  RegisterFormData,
  "firstname" | "lastname" | "email" | "password" | "confirmPassword"
> & { picture: File | null; address?: string }; // picture can be File or null

export interface RegisterProps {
  handleRegister: (values: RegisterFormValues, formikHelpers?: any) => void;
  loading: boolean;
  // formData: RegisterFormValues;
  // onFormDataChange: (data: RegisterFormData) => void;
  error: ErrorObject | null;
  errors: ErrorObject | null;
  validated: boolean;
}

export interface ErrorObject {
  success: boolean;
  error: string | null;
}

export interface RegisterFormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword?: string | undefined;
  picture?: File | null; // ✅ File ou null
  address?: string;
}
