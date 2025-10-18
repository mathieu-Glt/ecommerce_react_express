import { combineReducers } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import productSlice from "./productSlice";
import cartSlice from "./cartSlice";
import forgotPasswordReducer from "./forgotPasswordSlice";
// import cartReducer from './cartSlice';
// import categoryReducer from './categorySlice';
// import subCategoryReducer from './subCategorySlice';
// import productReducer from './productSlice';
// import commentsReducer from './commentsSlice';
// import usersReducer from './userSlice';
// import orderReducer from './orderSlice';
export const rootReducer = combineReducers({
  cart: cartSlice,
  // category: categoryReducer,
  // sub: subCategoryReducer,
  products: productSlice,
  // comments: commentsReducer,
  // users: usersReducer,
  auth: authSlice,
  forgotPassword: forgotPasswordReducer,
  // orders: orderReducer,
});
export type RootState = ReturnType<typeof rootReducer>;
