// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  TwitterAuthProvider,
  connectAuthEmulator,
} from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Services
export const analytics = (() => {
  try {
    return getAnalytics(app);
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "Firebase Analytics not initialized:",
        error?.message || error
      );
    }
    return null;
  }
})();
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Fournisseurs d'authentification
export const googleAuthProvider = new GoogleAuthProvider();
export const facebookAuthProvider = new FacebookAuthProvider();
export const githubAuthProvider = new GithubAuthProvider();
export const twitterAuthProvider = new TwitterAuthProvider();

// Connect emulators only if explicitly enabled via env flag
if (process.env.REACT_APP_USE_EMULATORS === "true") {
  try {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, "localhost", 8080);
    connectStorageEmulator(storage, "localhost", 9199);
  } catch (_) {
    // noop
  }
}
