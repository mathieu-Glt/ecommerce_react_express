import { API_ROUTES } from "../constants/api-routes";
import { useApi } from "../../hooks/useApi";
import type { AxiosInstance } from "axios";

// Define BASE_URL or import from your config
const BASE_URL = process.env.VITE_API_BASE_URL || "http://localhost:5173";
// eslint-disable-next-line react-hooks/rules-of-hooks
const api: AxiosInstance = useApi();
// function send email reset password
export async function sentEmailResetPasswordApi(body: {
  email: string;
}): Promise<any> {
  try {
    const sentEmail = await api.post(API_ROUTES.AUTH.RESET_PASSWORD, body);
    return sentEmail.data;
  } catch (error) {
    throw error;
  }
}
