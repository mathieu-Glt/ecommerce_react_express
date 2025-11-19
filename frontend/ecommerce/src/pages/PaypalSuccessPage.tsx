// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// export default function PaypalSuccessPage() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const query = new URLSearchParams(window.location.search);
//     const token = query.get("token");

//     if (!token) {
//       navigate("/paypal-failed");
//       return;
//     }

//     // Appel backend pour capturer le paiement
//     fetch(`${import.meta.env.VITE_API_BASE_URL}/payment/paypal/capture`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ orderId: token }),
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) {
//           // Rediriger vers page merci avec possibilité de télécharger la facture
//           navigate(`/merci?invoice=${encodeURIComponent(data.invoice)}`);
//         } else {
//           navigate("/paypal-failed");
//         }
//       })
//       .catch(() => navigate("/paypal-failed"));
//   }, []);

//   return <p>Validation du paiement PayPal…</p>;
// }
import { useSearchParams, Link } from "react-router-dom";

export default function MerciPagePaypal() {
  const [searchParams] = useSearchParams();
  const invoice = searchParams.get("invoice"); // "/invoices/..." renvoyé par backend

  const handleDownload = () => {
    if (!invoice) return;

    // Create a temporary link to download the PDF
    const link = document.createElement("a");
    link.href = `${
      import.meta.env.VITE_API_URL_SUCCESS_PAYMENT
    }/invoices/${invoice}`;
    link.download = invoice;
    link.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-md">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          🎉 Thank you for your purchase!
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment has been successfully confirmed.
        </p>

        {invoice ? (
          <button
            onClick={handleDownload}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
          >
            📄 Download my invoice
          </button>
        ) : (
          <p className="text-gray-400">No invoice available.</p>
        )}

        <Link
          to="/"
          className="mt-6 inline-block text-blue-600 hover:underline"
        >
          ← Return to Shop
        </Link>
      </div>
    </div>
  );
}
