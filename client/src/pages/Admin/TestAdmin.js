import { useSelector } from "react-redux";

function Test() {
  // const { user, profile, loading } = useUser();
  const { user } = useSelector((state) => state.user);

  return (
    <div className="container mt-4">
      <h1>Test component</h1>
      <div className="alert alert-success">
        The Test component works correctly !
      </div>

      <div className="card">
        <div className="card-body">
          <h5>User informations :</h5>
          <p>
            <strong>Connected :</strong> {user ? "Yes" : "No"}
          </p>
          <p>
            <strong>Email :</strong> {user?.email || "Non disponible"}
          </p>
          <p>
            <strong>Role :</strong> {user?.role || "Not defined"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Test;
