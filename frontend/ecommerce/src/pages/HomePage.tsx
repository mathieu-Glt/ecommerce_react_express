import { useUserContext } from "../context/userContext";

export const HomePage = () => {
  // Use context for take user, token and refreshToken
  const { user, token, isAuthenticated, refreshToken } = useUserContext();
  console.log("👤 User:", user);
  console.log("🔑 Token:", token);
  console.log("♻️ Refresh Token:", refreshToken);
  console.log("✅ Authenticated:", isAuthenticated);

  return (
    <div>
      {isAuthenticated ? (
        <p>Welcome, {user?.name || "User"}!</p>
      ) : (
        <p>Please log in.</p>
      )}
    </div>
  );
};
