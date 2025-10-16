import { combineReducers } from "@reduxjs/toolkit";
import type { Reducer } from "redux";
import authReducer from "./authSlice";
import forgotPasswordReducer from "./forgotPasswordSlice";
// import cartReducer from './cartSlice';
// import categoryReducer from './categorySlice';
// import subCategoryReducer from './subCategorySlice';
// import productReducer from './productSlice';
// import commentsReducer from './commentsSlice';
// import usersReducer from './userSlice';
// import orderReducer from './orderSlice';
export const rootReducer = combineReducers({
  // cart: cartReducer,
  // category: categoryReducer,
  // sub: subCategoryReducer,
  // products: productReducer,
  // comments: commentsReducer,
  // users: usersReducer,
  auth: authReducer,
  forgotPassword: forgotPasswordReducer,
  // orders: orderReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
