const initialState = {
  products: [],
  loading: false,
  error: null,
};

export const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_PRODUCTS_START":
      return { ...state, loading: true, error: null };
    case "FETCH_PRODUCTS_SUCCESS":
      return { ...state, loading: false, products: action.payload };
    case "FETCH_PRODUCTS_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "FETCH_PRODUCT_BY_SLUG_START":
      return { ...state, loading: true, error: null };
    case "FETCH_PRODUCT_BY_SLUG_SUCCESS":
      return { ...state, loading: false, products: action.payload };
    case "FETCH_PRODUCT_BY_SLUG_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "FETCH_PRODUCT_BY_ID_START":
      return { ...state, loading: true, error: null };
    case "FETCH_PRODUCT_BY_ID_SUCCESS":
      return { ...state, loading: false, products: action.payload };
    case "FETCH_PRODUCT_BY_ID_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "CREATE_PRODUCT_START":
      return { ...state, loading: true, error: null };
    case "CREATE_PRODUCT_SUCCESS":
      return {
        ...state,
        loading: false,
        products: [...state.products, action.payload],
      };
    case "CREATE_PRODUCT_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "UPDATE_PRODUCT_START":
      return { ...state, loading: true, error: null };
    case "UPDATE_PRODUCT_SUCCESS":
      return { ...state, loading: false, products: action.payload };
    case "UPDATE_PRODUCT_ERROR":
      return { ...state, loading: false, error: action.payload };

    case "DELETE_PRODUCT_START":
      return { ...state, loading: true, error: null };
    case "DELETE_PRODUCT_SUCCESS":
      return {
        ...state,
        loading: false,
        products: state.products.filter(
          (product) => product.id !== action.payload
        ),
      };
    case "DELETE_PRODUCT_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
