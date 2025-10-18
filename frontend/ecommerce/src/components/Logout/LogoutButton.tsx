import { useAuth } from "../../hooks/useAuth";
import { useMultipleLocalStorage } from "../../hooks/useLocalStorage";
import "./logoutButton.css";

export default function LogoutButton() {
  const { logout } = useAuth();
  // use loaclStorage of useLocalStorage
  const storage = useMultipleLocalStorage({
    user: null,
    token: "",
    refreshToken: "",
  });

  const handleLogout = async () => {
    // 1️⃣ Supprime les clés du localStorage
    storage.clearAll();
    // 2️⃣ Déconnecte Redux / middleware
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
