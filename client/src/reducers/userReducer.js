// userReducer.js
const initialState = {
  user: JSON.parse(
    localStorage.getItem("user") || sessionStorage.getItem("user") || "null"
  ),
  token:
    localStorage.getItem("token") || sessionStorage.getItem("token") || null,
  isAuthenticated: !!(
    localStorage.getItem("token") || sessionStorage.getItem("token")
  ),
  loading: false,
  error: null,
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    // LOGIN
    case "LOGIN_START":
      return { ...state, loading: true, error: null };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case "LOGIN_ERROR":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };

    // REGISTER
    case "REGISTER_START":
      return { ...state, loading: true, error: null };

    case "REGISTER_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case "REGISTER_ERROR":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };

    // GET CURRENT USER
    case "GET_CURRENT_USER_START":
      return { ...state, loading: true, error: null };

    case "GET_CURRENT_USER_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token || state.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case "GET_CURRENT_USER_ERROR":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };

    // UPDATE PROFILE
    case "UPDATE_PROFILE_START":
      return { ...state, loading: true, error: null };

    case "UPDATE_PROFILE_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        loading: false,
        error: null,
      };

    case "UPDATE_PROFILE_ERROR":
      return { ...state, loading: false, error: action.payload };

    // LEGACY COMPAT
    case "LOGGED_IN_USER":
      return {
        ...state,
        user: action.payload?.user || action.payload,
        token: action.payload?.token || state.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case "REGISTER_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      };

    case "REGISTER_USER_ERROR":
      return { ...state, error: action.payload, loading: false };

    // LOGOUT
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      };

    // CLEAR ERRORS
    case "CLEAR_AUTH_ERRORS":
      return { ...state, error: null };

    default:
      return state;
  }
};
