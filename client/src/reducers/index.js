import { combineReducers } from "redux";
import { userReducer } from "./userReducer";
import { manageUserReducer } from "./manageUserReducer";
import { categoryReducer } from "./categoryReducer";
import { subReducer } from "./subReducer";
import { productReducer } from "./productReducer";
import { cartReducer } from "./cartReducer";

export const rootReducer = combineReducers({
  user: userReducer,
  manageUser: manageUserReducer,
  category: categoryReducer,
  sub: subReducer,
  product: productReducer,
  cart: cartReducer,
});

export default rootReducer;
