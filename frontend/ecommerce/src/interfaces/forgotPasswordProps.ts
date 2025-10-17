/**
 * Props for ForgotPasswordForm component
 */

export interface ForgotPasswordProps {
  handleForgotPassword: (email: string) => void | Promise<void>;
  loading: boolean;
  error: string | null;
  success: string | null;
}
