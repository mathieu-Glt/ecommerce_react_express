import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import productSlice from "./productSlice";
import cartSlice from "./cartSlice";
import commentSlice from "./commentSlice";
import forgotPasswordReducer from "./forgotPasswordSlice";
import categorySlice from "./categorySlice";
import subCategorySlice from "./subCategorySlice";
// import usersSlice from './userSlice';
// import orderSlice from './orderSlice';
export const rootReducer = combineReducers({
  cart: cartSlice,
  category: categorySlice,
  sub: subCategorySlice,
  products: productSlice,
  comments: commentSlice,
  auth: authSlice,
  forgotPassword: forgotPasswordReducer,
  // users: usersSlice,
  // orders: orderSlice,
});
export type RootState = ReturnType<typeof rootReducer>;
