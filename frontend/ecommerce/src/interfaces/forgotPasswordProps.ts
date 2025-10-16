/**
 * Props for ForgotPasswordForm component
 */

export interface ForgotPasswordProps {
  handleForgotPassword: (
    event: React.FormEvent<HTMLFormElement>,
    email: string
  ) => void | Promise<void>;
  loading: boolean;
  error: string | null;
  success: string | null;
}
