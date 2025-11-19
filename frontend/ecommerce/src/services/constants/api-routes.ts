/**
 * API route constants for the eCommerce frontend application.
 * These constants define the endpoints for various services such as
 * authentication, products, users, categories, sub-categories, and comments.
 * Each route is organized under its respective service for easy access and maintenance.
 * @module api-routes
 */

export const API_ROUTES = {
  AUTH: {
    LOGIN: "auth/login",
    LOGIN_GOOGLE: "auth/google",
    LOGIN_AZURE: "auth/azure",
    LOGIN_GOOGLE_CALLBACK: "auth/google/callback",
    LOGIN_AZURE_CALLBACK: "auth/azure/callback",
    UPDATE_PROFILE: "auth/profile",
    LOGOUT: "auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",
    REGISTER: "auth/register",
    RESET_PASSWORD: "auth/reset-password",
    SENT_EMAIL_RESET_PASSWORD: "auth/reset-password/:token",
    VERIFY_EMAIL: "auth/verify-email",
    GET_PROFILE: "auth/user",
    CURRENT_USER: "auth/current-user",
  },
  PRODUCTS: {
    LIST: "products/",
    DETAILS_ID: (id: string) => `products/id/${id}`,
    DETAILS_SLUG: (slug: string) => `products/slug/${slug}`,
    CREATE: "products/",
    UPDATE: (id: string) => `products/${id}`,
    DELETE: (id: string) => `products/${id}`,
    SEARCH: "/products/search",
    LATEST: "products/latest",
    RATE_ADD: (id: string) => `products/${id}/rate`,
    RATE_UPDATE: (id: string) => `products/${id}/rate`,
    RATE_CHECK: (id: string) => `products/${id}/rate/check`,
    BY_CATEGORY_ID: (id: string) => `products/${id}/category`,
    BY_SUBS_CATEGORY_ID: (id: string) => `products/${id}/subs-category`,
    BY_CATEGORY_SLUG: (slug: string) => `products/category/${slug}`,
    BY_AVERAGE_RATE: "products/average-rate",
    BY_PRICE_RANGE: "products/price-range",
    BEST_SOLD: "products/sold-best",
    ACCESSORIES: "products/category/accessories",
    OUTILLAGE: "products/category/outillage",
  },
  USERS: {
    LIST: "users",
    DETAILS_ID: (id: string) => `users/${id}`,
    DETAILS_EMAIL: (email: string) => `users/${email}`,
    UPDATE: (id: string) => `users/${id}`,
    DELETE: (id: string) => `users/${id}`,
  },
  CATEGORIES: {
    LIST: "categories/",
    DETAILS_ID: (id: string) => `category/id/${id}`,
    DETAILS_SLUG: (slug: string) => `category/slug/${slug}`,
    CREATE: "category",
    UPDATE: (id: string) => `category/${id}`,
    DELETE: (id: string) => `category/${id}`,
  },
  SUB_CATEGORIES: {
    LIST: "subs/",
    // DETAILS_ID: (id: string) => `subs/id/${id}`, // existe pas pour le moment
    DETAILS_SLUG: (slug: string) => `subs/slug/${slug}`,
    CREATE: "subs",
    UPDATE: (slug: string) => `subs/${slug}`,
    DELETE: (slug: string) => `subs/${slug}`,
  },
  COMMENTS: {
    LIST: "comments/",
    LIST_BY_PRODUCT: (productId: string) => `comments/product/${productId}`,
    LIST_BY_USER: (userId: string) => `comments/user/${userId}`,
    CREATE: "comments/",
    UPDATE: (commentId: string) => `comments/${commentId}`,
    DELETE: (commentId: string) => `comments/${commentId}`,
  },
};
