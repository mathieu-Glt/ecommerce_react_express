import { useState, useEffect } from "react";

function useLocalStorage(key, initialValue) {
  // Lire la valeur initiale depuis localStorage ou fallback sur `initialValue`
  const readValue = () => {
    if (typeof window === "undefined") return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading "${key}" in localStorage`, error);
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState(readValue);

  // Fonction pour définir une valeur
  const setValue = (value) => {
    try {
      // Si la valeur est une fonction, l'exécuter avec la valeur actuelle
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);

      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error writing "${key}" in localStorage`, error);
    }
  };

  // Fonction pour supprimer une valeur
  const removeValue = () => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
      setStoredValue(undefined);
    } catch (error) {
      console.warn(`Error removing "${key}" from localStorage`, error);
    }
  };

  // Fonction pour vider tout le localStorage
  const clearAll = () => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.clear();
      }
      setStoredValue(undefined);
    } catch (error) {
      console.warn(`Error clearing localStorage`, error);
    }
  };

  // Fonction pour vérifier si une clé existe
  const hasValue = () => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(key) !== null;
  };

  // Écouter les changements dans d'autres onglets
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== e.oldValue) {
        setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue, clearAll, hasValue];
}

export default useLocalStorage;
