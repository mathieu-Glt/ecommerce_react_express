import type { User } from "./user.interface";

// Réponse de base
class ResponseInterface {
  status?: number;
  message?: string;
}

export interface LogoutSuccessResponse {
  success: true;
  message: string;
}

// Réponse succès
export interface ResponseSuccessInterface extends ResponseInterface {
  success?: true; // discriminant
  results?: object; // ici tu peux mettre { user, token }
  user?: User;
  message?: string;
  token?: string | null | undefined;
  refreshToken?: string | null | undefined;
}

// Réponse erreur
export interface ResponseErrorInterface extends ResponseInterface {
  success: boolean;
  message?: string;
  error: string;
}

// Union discriminée
export type ApiResponse = ResponseSuccessInterface | ResponseErrorInterface;

export interface SignUpResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface ResponseDataRegisterThunk {}
