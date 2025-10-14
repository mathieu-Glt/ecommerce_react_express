// auth.test.ts
import axios, { AxiosResponse, AxiosError } from "axios";
import { signIn } from "../../src/services/api/auth";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("signIn", () => {
  const loginData = {
    email: "test@example.com",
    password: "password123",
  };

  const apiResponse = {
    user: {
      id: 1,
      email: "test@example.com",
      firstname: "Test",
      lastname: "User",
    },
    token: "fake-jwt-token",
    refreshToken: "fake-refresh-token",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("devrait retourner les données de l'API en cas de succès", async () => {
    const axiosResponse: AxiosResponse = {
      data: apiResponse,
      status: 200,
      statusText: "OK",
      headers: {},
      config: {},
    };

    mockedAxios.post.mockResolvedValueOnce(axiosResponse);

    const result = await signIn(loginData);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.any(String),
      loginData
    );
    expect(result).toEqual(apiResponse);
  });

  it("devrait lancer une erreur avec le message de l'API en cas d'erreur Axios", async () => {
    const errorMessage = "Invalid credentials";
    const axiosError = {
      isAxiosError: true,
      response: { data: { error: errorMessage } },
      message: "Request failed",
      config: {},
      toJSON: () => ({}),
    } as AxiosError;

    mockedAxios.post.mockRejectedValueOnce(axiosError);

    await expect(signIn(loginData)).rejects.toThrow(errorMessage);
  });

  it("devrait lancer une erreur générique si ce n'est pas un AxiosError", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("Network failure"));

    await expect(signIn(loginData)).rejects.toThrow("Failed during signIn");
  });
});
