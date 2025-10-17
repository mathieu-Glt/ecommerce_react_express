export interface ResetPasswordState {
  loading: boolean;
  success: string | null;
  error: string | null;
}

export interface DataResetPassword {
  password: string;
  confirmPassword: string;
  token: string;
}
