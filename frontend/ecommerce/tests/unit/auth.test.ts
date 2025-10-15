// tests/unit/auth.test.ts

// ✅ 1. Créer le mock d'API AVANT tout import
const mockPost = jest.fn();
const mockGet = jest.fn();
const mockPut = jest.fn();
const mockDelete = jest.fn();

// ✅ 2. Mock useApi AVANT d'importer auth.ts
jest.mock("../../src/hooks/useApi", () => ({
  useApi: jest.fn(() => ({
    post: mockPost,
    get: mockGet,
    put: mockPut,
    delete: mockDelete,
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  })),
}));

// ✅ 3. MAINTENANT importer auth.ts et les dépendances
import { AxiosResponse } from "axios";
import { signIn } from "../../src/services/api/auth";
import { API_ROUTES } from "../../src/services/constants/api-routes";
import type { LoginResponse } from "../../src/interfaces/response.interface";

describe("signIn", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const loginData = {
    email: "test@example.com",
    password: "password123",
  };

  const apiResponse: LoginResponse = {
    success: true,
    message: "Connection successful",
    user: {
      _id: "user123",
      email: "test@example.com",
      name: "Test User",
      firstname: "Test",
      lastname: "User",
      picture: "https://example.com/avatar.png",
      address: "",
      role: "user",
      createdAt: "2025-10-15T12:00:00.000Z",
      updatedAt: "2025-10-15T12:00:00.000Z",
    },
    token: "fake-jwt-token",
    refreshToken: "fake-refresh-token",
  };

  /**
   * TEST 1 : Login réussi
   */
  it("devrait retourner les données de connexion en cas de succès", async () => {
    const axiosResponse: AxiosResponse<LoginResponse> = {
      data: apiResponse,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };

    // ✅ Mock la réponse
    mockPost.mockResolvedValueOnce(axiosResponse);

    const result = await signIn(loginData);

    // Vérifications
    expect(mockPost).toHaveBeenCalledWith(API_ROUTES.AUTH.LOGIN, loginData);
    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(result).toEqual(apiResponse);
    expect(result.success).toBe(true);
    expect(result.user.email).toBe("test@example.com");
    expect(result.token).toBe("fake-jwt-token");
  });

  /**
   * TEST 2 : Login avec identifiants incorrects
   */
  it("devrait lancer une erreur en cas d'identifiants incorrects", async () => {
    const errorResponse = {
      response: {
        data: {
          error: "Invalid credentials",
        },
        status: 401,
      },
    };

    mockPost.mockRejectedValueOnce(errorResponse);

    await expect(signIn(loginData)).rejects.toThrow("Invalid credentials");
    expect(mockPost).toHaveBeenCalledWith(API_ROUTES.AUTH.LOGIN, loginData);
  });

  /**
   * TEST 3 : Erreur réseau
   */
  it("devrait lancer une erreur en cas de problème réseau", async () => {
    const networkError = new Error("Network Error");

    mockPost.mockRejectedValueOnce(networkError);

    await expect(signIn(loginData)).rejects.toThrow("Failed during signIn");
  });

  /**
   * TEST 4 : Email manquant
   */
  it("devrait lancer une erreur si l'email est manquant", async () => {
    const errorResponse = {
      response: {
        data: {
          error: "Email is required",
        },
        status: 400,
      },
    };

    mockPost.mockRejectedValueOnce(errorResponse);

    await expect(
      signIn({ email: "", password: "password123" })
    ).rejects.toThrow("Email is required");
  });

  /**
   * TEST 5 : Mot de passe manquant
   */
  it("devrait lancer une erreur si le mot de passe est manquant", async () => {
    const errorResponse = {
      response: {
        data: {
          error: "Password is required",
        },
        status: 400,
      },
    };

    mockPost.mockRejectedValueOnce(errorResponse);

    await expect(
      signIn({ email: "test@example.com", password: "" })
    ).rejects.toThrow("Password is required");
  });

  /**
   * TEST 6 : Vérifier la structure complète de la réponse
   */
  it("devrait retourner une réponse avec la structure correcte", async () => {
    const axiosResponse: AxiosResponse<LoginResponse> = {
      data: apiResponse,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };

    mockPost.mockResolvedValueOnce(axiosResponse);

    const result = await signIn(loginData);

    expect(result).toHaveProperty("success");
    expect(result).toHaveProperty("message");
    expect(result).toHaveProperty("user");
    expect(result).toHaveProperty("token");
    expect(result).toHaveProperty("refreshToken");

    expect(result.user).toHaveProperty("_id");
    expect(result.user).toHaveProperty("email");
    expect(result.user).toHaveProperty("firstname");
    expect(result.user).toHaveProperty("lastname");
    expect(result.user).toHaveProperty("name");
    expect(result.user).toHaveProperty("role");
    expect(result.user).toHaveProperty("createdAt");
    expect(result.user).toHaveProperty("updatedAt");
  });

  /**
   * TEST 7 : Erreur 500 du serveur
   */
  it("devrait gérer les erreurs 500 du serveur", async () => {
    const serverError = {
      response: {
        data: {
          error: "Internal server error",
        },
        status: 500,
      },
    };

    mockPost.mockRejectedValueOnce(serverError);

    await expect(signIn(loginData)).rejects.toThrow("Internal server error");
  });

  /**
   * TEST 8 : Vérifier que les logs console sont appelés
   */
  it("devrait logger les informations de connexion", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    const axiosResponse: AxiosResponse<LoginResponse> = {
      data: apiResponse,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };

    mockPost.mockResolvedValueOnce(axiosResponse);

    await signIn(loginData);

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
