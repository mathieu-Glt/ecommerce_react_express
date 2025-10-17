/**
 * Props for ResetPasswordProps component
 */

export interface ResetPasswordProps {
  handleResetPassword: (
    password: string,
    confirmPassword: string
  ) => void | Promise<void>;
  loading: boolean;
  error: string | null;
  success: string | null;
}
