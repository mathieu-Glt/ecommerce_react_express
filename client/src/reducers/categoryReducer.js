const initialState = {
  categories: [],
  loading: false,
  error: null,
};

export const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_CATEGORIES_START":
      return { ...state, loading: true, error: null };
    case "FETCH_CATEGORIES_SUCCESS":
      console.log("🔄 Reducer: FETCH_CATEGORIES_SUCCESS reçu");
      console.log("📦 Payload:", action.payload);
      console.log("📦 Type payload:", typeof action.payload);
      console.log("📦 Est tableau:", Array.isArray(action.payload));
      return { ...state, loading: false, categories: action.payload };
    case "FETCH_CATEGORIES_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "CREATE_CATEGORY_START":
      return { ...state, loading: true, error: null };
    case "CREATE_CATEGORY_SUCCESS":
      return {
        ...state,
        loading: false,
        categories: [...state.categories, action.payload],
      };
    case "CREATE_CATEGORY_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "UPDATE_CATEGORY_START":
      return { ...state, loading: true, error: null };
    case "UPDATE_CATEGORY_SUCCESS":
      return {
        ...state,
        loading: false,
        categories: state.categories.map((cat) =>
          cat._id === action.payload._id ? action.payload : cat
        ),
      };
    case "UPDATE_CATEGORY_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "DELETE_CATEGORY_START":
      return { ...state, loading: true, error: null };
    case "DELETE_CATEGORY_SUCCESS":
      return {
        ...state,
        loading: false,
        categories: state.categories.filter(
          (cat) => cat._id !== action.payload
        ),
      };
    case "DELETE_CATEGORY_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
