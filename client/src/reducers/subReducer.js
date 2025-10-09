const initialState = {
  subs: [],
  loading: false,
  error: null,
};

export const subReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_SUBS_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUBS_SUCCESS":
      return { ...state, loading: false, subs: action.payload };
    case "FETCH_SUBS_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "CREATE_SUB_START":
      return { ...state, loading: true, error: null };
    case "CREATE_SUB_SUCCESS":
      return {
        ...state,
        loading: false,
        subs: [...state.subs, action.payload],
      };
    case "CREATE_SUB_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "UPDATE_SUB_START":
      return { ...state, loading: true, error: null };
    case "UPDATE_SUB_SUCCESS":
      return {
        ...state,
        loading: false,
        subs: state.subs.map((sub) =>
          sub._id === action.payload._id ? action.payload : sub
        ),
      };
    case "UPDATE_SUB_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "DELETE_SUB_START":
      return { ...state, loading: true, error: null };
    case "DELETE_SUB_SUCCESS":
      return {
        ...state,
        loading: false,
        subs: state.subs.filter((sub) => sub._id !== action.payload),
      };
    case "DELETE_SUB_ERROR":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};
