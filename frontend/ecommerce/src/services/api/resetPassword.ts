import { API_ROUTES } from "../constants/api-routes";
import { useApi } from "../../hooks/useApi";
import type { AxiosInstance } from "axios";
// Define BASE_URL or import from your config
const BASE_URL = process.env.VITE_API_BASE_URL || "http://localhost:5173";
// eslint-disable-next-line react-hooks/rules-of-hooks
const api: AxiosInstance = useApi();

export const resetPasswordApi = async (data: {
  password: string;
  token: string;
}): Promise<any> => {
  try {
    console.log("=== SENDING TO API ===");
    console.log("data:", data);
    console.log("data.password:", data.password);
    const response = await api.post(
      API_ROUTES.AUTH.SENT_EMAIL_RESET_PASSWORD.replace(":token", data.token),
      { password: data.password }
    );
    return response.data;
  } catch (error) {
    console.log("=== API ERROR ===");
    console.log("error.response?.data:", error.response?.data);
    console.log("error auth" + error);

    console.error("Error sending reset password email:", error);
    throw error;
  }
};
