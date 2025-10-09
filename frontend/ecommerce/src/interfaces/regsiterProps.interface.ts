import { signUpValidationSchema } from "../validators/validatorsFormRegister";

/**
 * Register form data structure
 */
export interface RegisterFormData {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  address?: string;
  picture: string;
  confirmPassword: string;
}
