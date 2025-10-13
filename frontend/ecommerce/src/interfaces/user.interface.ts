export interface User {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  avatar?: string;
  name?: string;
  role?: "admin" | "user" | "moderator";
  isActive: boolean;
  cart?: any[];
  address?: string;
  picture?: string;
  googleId?: string;
  azureId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken?: string | null;
  isAuthenticated: boolean;
  error: string | null | object;
  loading: boolean;
}
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  address?: string;
  picture: string;
  confirmPassword: string;
}



export interface ResponseDataLogin {
  user: User;
  token: string;
  refreshToken: string;
}
export interface ResponseDataRegister {
  user: User;
}
export interface payloadDataUser {
  user: User;
}
export interface payloadDataToken {
  token: string;
}
export interface payloadDataRefreshToken {
  refreshToken: string;
}

export interface SignUpResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface ExtractLoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}
export interface ExtractRegisterResponse {
  user: User;
}
