import { useState, useCallback, useEffect } from "react";

/**
 * Custom hook for managing localStorage with React state synchronization
 * Optimized with useCallback for performance
 *
 * @template T - Type of the value to store
 * @param key - localStorage key
 * @param initialValue - Default value if key doesn't exist
 * @returns Tuple of [storedValue, setValue] similar to useState
 *
 * @example
 * const [user, setUser] = useLocalStorage<User | null>("user", null);
 *
 * // Set value
 * setUser({ id: 1, name: "John" });
 *
 * // Update with function
 * setUser((prev) => ({ ...prev, name: "Jane" }));
 *
 * // Clear value
 * setUser(null);
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): readonly [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Check if window is defined (SSR compatibility)
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);

      // Parse stored json or if none return initialValue
      if (item) {
        return JSON.parse(item) as T;
      }

      // If no item found, store initial value
      window.localStorage.setItem(key, JSON.stringify(initialValue));
      return initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  /**
   * Memoized setter function to update both state and localStorage
   * Prevents recreation on every render
   */
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        // Save state
        setStoredValue(valueToStore);

        // Save to local storage
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));

          console.log(`✅ localStorage updated: ${key}`, valueToStore);

          // Dispatch storage event for cross-tab synchronization
          window.dispatchEvent(
            new StorageEvent("storage", {
              key,
              newValue: JSON.stringify(valueToStore),
              storageArea: window.localStorage,
            })
          );
        }
      } catch (error) {
        // Handle quota exceeded error or other localStorage errors
        console.error(`Error setting localStorage key "${key}":`, error);

        // Optionally handle quota exceeded
        if (
          error instanceof DOMException &&
          error.name === "QuotaExceededError"
        ) {
          console.error("localStorage quota exceeded!");
          // TODO: Implement cleanup strategy
        }
      }
    },
    [key, storedValue]
  );

  /**
   * Memoized remove function to clear the value from localStorage
   */
  const removeValue = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
        setStoredValue(initialValue);

        console.log(`🗑️ localStorage removed: ${key}`);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes to this key from other tabs/windows
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue) as T;
          setStoredValue(newValue);
          console.log(
            `🔄 localStorage synced from another tab: ${key}`,
            newValue
          );
        } catch (error) {
          console.error(`Error parsing storage event for key "${key}":`, error);
        }
      } else if (e.key === key && e.newValue === null) {
        // Key was removed in another tab
        setStoredValue(initialValue);
        console.log(`🔄 localStorage cleared in another tab: ${key}`);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue] as const;
}

/**
 * Extended version with additional utilities
 *
 * @example
 * const storage = useLocalStorageExtended<User>("user", null);
 *
 * storage.value // Get value
 * storage.setValue(user) // Set value
 * storage.remove() // Remove value
 * storage.refresh() // Refresh from localStorage
 */
export function useLocalStorageExtended<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useLocalStorage(key, initialValue);

  /**
   * Removes the item from localStorage
   */
  const remove = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
        setStoredValue(initialValue);
        console.log(`🗑️ localStorage removed: ${key}`);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue, setStoredValue]);

  /**
   * Refreshes the value from localStorage
   * Useful if localStorage was modified outside of React
   */
  const refresh = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(key);
        if (item) {
          const value = JSON.parse(item) as T;
          setStoredValue(value);
          console.log(`🔄 localStorage refreshed: ${key}`, value);
        } else {
          setStoredValue(initialValue);
        }
      }
    } catch (error) {
      console.error(`Error refreshing localStorage key "${key}":`, error);
    }
  }, [key, initialValue, setStoredValue]);

  /**
   * Checks if the key exists in localStorage
   */
  const exists = useCallback((): boolean => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.localStorage.getItem(key) !== null;
  }, [key]);

  return {
    value: storedValue,
    setValue: setStoredValue,
    remove,
    refresh,
    exists,
  };
}

/**
 * Hook for managing multiple localStorage keys at once
 *
 * @example
 * const storage = useMultipleLocalStorage({
 *   user: null,
 *   token: "",
 *   settings: {}
 * });
 *
 * storage.user.value
 * storage.user.setValue(newUser)
 * storage.clearAll()
 */
export function useMultipleLocalStorage<T extends Record<string, any>>(
  keys: T
): {
  [K in keyof T]: {
    value: T[K];
    setValue: (value: T[K] | ((val: T[K]) => T[K])) => void;
  };
} & { clearAll: () => void } {
  const storageHooks = Object.entries(keys).reduce(
    (acc, [key, initialValue]) => {
      const [value, setValue] = useLocalStorage(key, initialValue);
      acc[key] = { value, setValue };
      return acc;
    },
    {} as any
  );

  const clearAll = useCallback(() => {
    Object.keys(keys).forEach((key) => {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    });
    console.log("🗑️ All localStorage keys cleared");
  }, [keys]);

  return {
    ...storageHooks,
    clearAll,
  };
}
