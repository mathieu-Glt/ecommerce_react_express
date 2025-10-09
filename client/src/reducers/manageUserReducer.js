const initialState = {
  users: [],
  loading: false,
  error: null,
};

export const manageUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_USERS_START":
      return { ...state, loading: true, error: null };
    case "FETCH_USERS_SUCCESS":
      console.log("🔄 Reducer: FETCH_USERS_SUCCESS reçu");
      console.log("📦 Payload:", action.payload);
      console.log("📦 Type payload:", typeof action.payload);
      console.log("📦 Est tableau:", Array.isArray(action.payload));
      return { ...state, loading: false, users: action.payload };
    case "FETCH_USERS_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "CREATE_USER_START":
      return { ...state, loading: true, error: null };
    case "CREATE_USER_SUCCESS":
      return {
        ...state,
        loading: false,
        users: [...state.users, action.payload],
      };
    case "CREATE_USER_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "UPDATE_USER_START":
      return { ...state, loading: true, error: null };
    case "UPDATE_USER_SUCCESS":
      return {
        ...state,
        loading: false,
        users: state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        ),
      };
    case "UPDATE_USER_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "DELETE_USER_START":
      return { ...state, loading: true, error: null };
    case "DELETE_USER_SUCCESS":
      return {
        ...state,
        loading: false,
        users: state.users.filter((user) => user._id !== action.payload),
      };
    case "DELETE_USER_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
