import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import { getMyOrders } from "../Services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getMyOrders()
      .then((res) => setOrders(res.data.orders))
      .catch((err) => setError(err.response?.data?.message || "Could not load orders."))
      .finally(() => setLoading(false));
  }, []);

  let content;

  if (loading) {
    content = <p className="text-center text-gray-600 py-20">Loading orders...</p>;
  } else if (error) {
    content = <p className="text-center text-red-600 py-20">{error}</p>;
  } else if (orders.length === 0) {
    content = (
      <div className="text-center py-20">
        <p className="text-gray-600">You have not placed any orders yet.</p>
        <Link
          to="/products"
          className="inline-block mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl"
        >
          Start Shopping
        </Link>
      </div>
    );
  } else {
    content = (
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-gray-900">Order #{o._id.slice(-8)}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(o.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700">
                {o.status}
              </span>
            </div>

            <div className="mt-3 text-sm text-gray-700 space-y-1">
              {o.items.map((i) => (
                <p key={i._id}>
                  {i.name} × {i.quantity}
                </p>
              ))}
            </div>

            <div className="mt-4 flex justify-between items-center">
              <p className="font-bold text-gray-900">
                Total: ₹{o.totalAmount.toLocaleString("en-IN")}
              </p>
              <Link
                to={`/orders/${o._id}`}
                className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">My Orders</h1>
        {content}
      </main>
    </div>
  );
}