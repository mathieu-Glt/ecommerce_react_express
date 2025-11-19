import { useSearchParams, Link } from "react-router-dom";

export default function MerciPage() {
  const [searchParams] = useSearchParams();
  const invoice = searchParams.get("invoice");

  const handleDownload = () => {
    if (!invoice) return;
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
          ← Back to shop
        </Link>
      </div>
    </div>
  );
}
