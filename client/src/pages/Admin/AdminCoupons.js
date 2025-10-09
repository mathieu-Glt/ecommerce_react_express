import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useToast from "../../hooks/useToast";

function AdminCoupons() {
  const dispatch = useDispatch();
  const { showSuccess, showError, showLoading } = useToast();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discount: "",
    validFrom: "",
    validTo: "",
    maxUses: "",
    isActive: true,
  });

  // Charger les coupons (placeholder - à implémenter avec l'API)
  useEffect(() => {
    const loadCoupons = async () => {
      setLoading(true);
      try {
        // TODO: Implémenter l'API pour les coupons
        // const response = await fetchCouponsAPI();
        // setCoupons(response.data);

        // Données de test pour l'instant
        setCoupons([
          {
            _id: "1",
            code: "WELCOME10",
            discount: 10,
            validFrom: "2024-01-01",
            validTo: "2024-12-31",
            maxUses: 100,
            isActive: true,
          },
        ]);
      } catch (err) {
        console.error("Error loading coupons:", err);
        // Utiliser showError directement dans le catch sans dépendance
        showError("Error loading coupons");
      } finally {
        setLoading(false);
      }
    };

    loadCoupons();
  }, []); // Retirer showError des dépendances

  // Créer un nouveau coupon
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    const loadingToast = showLoading("Creating coupon...");

    try {
      // TODO: Implémenter l'API pour créer un coupon
      const mockCoupon = {
        _id: Date.now().toString(),
        ...newCoupon,
        createdAt: new Date().toISOString(),
      };

      setCoupons([...coupons, mockCoupon]);
      setNewCoupon({
        code: "",
        discount: "",
        validFrom: "",
        validTo: "",
        maxUses: "",
        isActive: true,
      });

      showSuccess("Coupon created successfully!");
    } catch (err) {
      showError("Error creating coupon");
      console.error("Error creating coupon:", err);
    }
  };

  // Supprimer un coupon
  const handleDeleteCoupon = async (id) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;

    const loadingToast = showLoading("Deleting coupon...");

    try {
      // TODO: Implémenter l'API pour supprimer un coupon
      setCoupons(coupons.filter((coupon) => coupon._id !== id));
      showSuccess("Coupon deleted successfully!");
    } catch (err) {
      showError("Error deleting coupon");
      console.error("Error deleting coupon:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h1>Coupon Management</h1>

      {/* Formulaire pour créer un nouveau coupon */}
      <div className="card mb-4">
        <div className="card-header">
          <h3>Add New Coupon</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleCreateCoupon}>
            <div className="row">
              <div className="col-md-3">
                <div className="mb-3">
                  <label className="form-label">Code</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newCoupon.code}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, code: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="mb-3">
                  <label className="form-label">Discount (%)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newCoupon.discount}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, discount: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="mb-3">
                  <label className="form-label">Valid From</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newCoupon.validFrom}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, validFrom: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="mb-3">
                  <label className="form-label">Valid To</label>
                  <input
                    type="date"
                    className="form-control"
                    value={newCoupon.validTo}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, validTo: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="mb-3">
                  <label className="form-label">Max Uses</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newCoupon.maxUses}
                    onChange={(e) =>
                      setNewCoupon({ ...newCoupon, maxUses: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="col-md-1">
                <div className="mb-3">
                  <label className="form-label">Active</label>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={newCoupon.isActive}
                      onChange={(e) =>
                        setNewCoupon({
                          ...newCoupon,
                          isActive: e.target.checked,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Create Coupon
            </button>
          </form>
        </div>
      </div>

      {/* Liste des coupons existants */}
      <div className="card">
        <div className="card-header">
          <h3>Existing Coupons</h3>
        </div>
        <div className="card-body">
          {loading ? (
            <p>Loading...</p>
          ) : coupons.length === 0 ? (
            <p>No coupons found</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Discount</th>
                    <th>Valid From</th>
                    <th>Valid To</th>
                    <th>Max Uses</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon) => (
                    <tr key={coupon._id}>
                      <td>
                        <code>{coupon.code}</code>
                      </td>
                      <td>{coupon.discount}%</td>
                      <td>{new Date(coupon.validFrom).toLocaleDateString()}</td>
                      <td>{new Date(coupon.validTo).toLocaleDateString()}</td>
                      <td>{coupon.maxUses}</td>
                      <td>
                        <span
                          className={`badge ${
                            coupon.isActive ? "bg-success" : "bg-secondary"
                          }`}
                        >
                          {coupon.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDeleteCoupon(coupon._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCoupons;
