import type { SignInFormValues } from "../validators/validatorFormLogin";

/**
 * Props for LoginForm component
 */
export interface LoginProps {
  handleLogin: (values: SignInFormValues, formikHelpers?: any) => void;
  loading: boolean;
  formData: LoginFormData;
  onFormDataChange: (data: LoginFormData) => void;
  onGoogleLogin: () => void | Promise<void>;
  onAzureLogin: () => void | Promise<void>;
  error: string | null;
  validated: boolean;
}
/**
 * Login form data structure
 */
export interface LoginFormData {
  email: string;
  password: string;
}
