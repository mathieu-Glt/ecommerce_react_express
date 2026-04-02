import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./redux/slices";
import { localStorageMiddleware } from "./redux/middleware/localStorageMiddleware";

// STORE CONFIGURATION

// On crée le store Redux avec Redux Toolkit
// configureStore permet de combiner reducers, middleware et DevTools
export const store = configureStore({
  // On fournit le reducer principal combiné
  reducer: rootReducer,

  // Middleware
  // getDefaultMiddleware inclut déjà thunk et serializableCheck
  // On concatène notre middleware personnalisé pour gérer localStorage
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

// TYPESCRIPT HELPERS

// RootState : type de l'état global du store
// On utilise le rootReducer pour éviter les références circulaires
// Cela permet de typer correctement useSelector dans les composants
export type RootState = ReturnType<typeof rootReducer>;

// AppDispatch : type du dispatch du store
// Permet d'utiliser dispatch avec les thunks et actions typées
// Exemple : const dispatch: AppDispatch = useDispatch();
export type AppDispatch = typeof store.dispatch;
