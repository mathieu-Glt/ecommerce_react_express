import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
} from "axios";
import { useApi } from "../../hooks/useApi";
import type { CurrentUserResponse } from "../../interfaces/response.interface";
import { API_ROUTES } from "../constants/api-routes";

// Define BASE_URL or import from your config
const BASE_URL = process.env.VITE_API_BASE_URL || "http://localhost:5173";
// eslint-disable-next-line react-hooks/rules-of-hooks
const api: AxiosInstance = useApi();
