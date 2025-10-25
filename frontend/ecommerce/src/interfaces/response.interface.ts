import type { User } from "./user.interface";

/**
 * Interface pour les erreurs API
 * success doit TOUJOURS être false pour les erreurs
 */
export interface ResponseErrorInterface {
  success: false; // ✅ Pas optionnel, toujours false
  error: string; // ✅ Message d'erreur obligatoire
  message?: string;
  status?: number;
}

/**
 * Interface pour la réponse de LOGOUT
 */
export interface LogoutSuccessResponse {
  success: true;
  message: string;
}

/**
 * Interface spécifique pour la réponse de LOGIN
 * Tous les champs sont OBLIGATOIRES (pas de ?)
 */
export interface LoginResponse {
  success: true; // ✅ Obligatoire
  message: string; // ✅ Obligatoire
  user: User; // ✅ Obligatoire
  token: string; // ✅ Obligatoire
  refreshToken: string; // ✅ Obligatoire
  data?: DataResponseAuth;
}
interface DataResponseAuth {
  user: User;
  token: string;
  refreshToken: string;
}

/**
 * Interface spécifique pour la réponse de REGISTER
 */
export interface RegisterResponse {
  success: true;
  message: string;
  user: User;
}

/**
 * Interface pour la réponse du PROFILE
 */
export interface ProfileResponse {
  success: true;
  message?: string;
  user: User;
}

/**
 * Interface générique pour les succès (utilisée pour d'autres endpoints)
 */
export interface ResponseSuccessInterface {
  success: true;
  message?: string;
  results?: any;
  status?: number;
}

/**
 * Interface spécifique pour la réponse de FORGOT PASSWORD
 */
export interface ForgotPasswordResponse {
  success: true;
  status?: number;
  message: string;
  results?: string; // Message de confirmation
}
/**
 * Interface spécifique pour la réponse de FORGOT PASSWORD
 */
export interface ResetPasswordResponse {
  status: true;
  message: string;
  results?: string; // Message de confirmation
}

/**
 * Interface spécifique pour la réponse de FORGOT PASSWORD
 */
export interface ResetPasswordResponse {
  success: true;
  message: string;
  results?: string; // Message de confirmation
}
export interface LoginApiResponse {
  success: boolean;
  results: {
    user: User;
    token?: string; // Token optionnel si pas fourni lors de l'inscription
    refreshToken?: string;
  };
  message?: string;
}

/**
 * Type union pour toutes les réponses API possibles
 * TypeScript peut maintenant distinguer les types grâce au champ 'success'
 */
export type ApiResponse =
  | LoginResponse
  | RegisterResponse
  | ProfileResponse
  | LogoutSuccessResponse
  | ForgotPasswordResponse
  | ResponseSuccessInterface
  | ResponseErrorInterface;

/**
 * Type guard pour vérifier si c'est une erreur
 */
export function isErrorResponse(
  response: ApiResponse
): response is ResponseErrorInterface {
  return response.success === false;
}

/**
 * Type guard pour vérifier si c'est une réponse de login
 */
export function isLoginResponse(
  response: ApiResponse
): response is LoginResponse {
  return (
    response.success === true &&
    "token" in response &&
    "refreshToken" in response &&
    "user" in response
  );
}

/**
 * Type guard pour vérifier si c'est une réponse de register
 */
export function isRegisterResponse(
  response: ApiResponse
): response is RegisterResponse {
  return (
    response.success === true && "user" in response && !("token" in response)
  );
}

/**
 * Type guard pour vérifier si c'est une réponse de profile
 */
export function isProfileResponse(
  response: ApiResponse
): response is ProfileResponse {
  return (
    response.success === true && "user" in response && !("token" in response)
  );
}
/**
 * Type guard pour vérifier retour réponse succés générique current user
 */
export interface CurrentUserResponse {
  success: true;
  user: User;
}

export interface FetchCurrentUserResponse {
  success: true;
  user: User;
}

// Alias pour compatibilité avec ton code existant
export interface SignUpResponse extends RegisterResponse {}
export interface ResponseDataRegisterThunk extends RegisterResponse {}

// class ResponseInterface {
//   status?: number;
//   message?: string;
// }

// export interface LogoutSuccessResponse {
//   success: true;
//   message: string;
// }

// // Réponse succès
// export interface ResponseSuccessInterface extends ResponseInterface {
//   success?: true;
//   results?: object; // ici tu peux mettre { user, token }
//   user?: User;
//   message?: string;
//   token?: string | null | undefined;
//   refreshToken?: string | null | undefined;
// }

// // Réponse erreur
// export interface ResponseErrorInterface extends ResponseInterface {
//   success: boolean;
//   message?: string;
//   error: string;
// }

// // Union discriminée
// export type ApiResponse = ResponseSuccessInterface | ResponseErrorInterface;

// export interface SignUpResponse {
//   success: boolean;
//   message: string;
//   user: User;
// }

// export interface ResponseDataRegisterThunk {}
