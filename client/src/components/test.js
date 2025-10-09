import React from "react";

export const Test = () => {
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate an async operation like an API call
    const result = axios.post("https://jsonplaceholder.typicode.com/todos/1", {
      password,
    });
    console.log(result);
    setTimeout(() => {
      console.log("Nouveau mot de passe soumis:", password);
      setLoading(false);
    }, 2000);
  }; // ✅ on ferme handleSubmit ici

  const passwordUpdateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Votre nouveau mot de passe</label>
        <input
          type="password"
          className="form-control"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Entrez votre nouveau mot de passe"
          value={password}
          autoFocus
          required
        />
      </div>
      <br />
      <button className="btn btn-primary" disabled={!password || loading}>
        {loading ? <i className="fas fa-spinner fa-spin"></i> : "Valider"}
      </button>
    </form>
  );

  return (
    <div>
      <h4>Réinitialisation du mot de passe</h4>
      {passwordUpdateForm()}
    </div>
  );
};
