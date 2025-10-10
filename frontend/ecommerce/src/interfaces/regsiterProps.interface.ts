/**
 * Register form data structure
 */
/**
 * Props for LoginForm component
 */
import type { RegisterFormValues } from "../validators/validatorsFormRegister"; // Update the path as needed

export interface RegisterProps {
  handleRegister: (values: RegisterFormValues, formikHelpers?: any) => void;
  loading: boolean;
  formData: RegisterFormValues;
  onFormDataChange: (data: RegisterFormData) => void;
  error: string | null;
  validated: boolean;
}

export interface RegisterFormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  picture?: string;
  address?: string;
}
