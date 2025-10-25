import { useAuth } from "../../hooks/useAuth";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import "./logoutButton.css";

export default function LogoutButton() {
  const { logout } = useAuth();
  const { setToken, setRefreshToken, clearTokens } = useLocalStorage();
  // Initialize hooks for each localStorage key
  const handleLogout = async () => {
    // Supprime les clés du localStorage
    clearTokens();
    // Déconnecte Redux / middleware
    await logout();
  };

  return (
    <div>
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}
