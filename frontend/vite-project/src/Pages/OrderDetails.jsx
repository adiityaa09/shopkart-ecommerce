import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { getOrderById } from "../Services/api";

export default function OrderDetails({ success = false }) {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getOrderById(id)
      .then((res) => setOrder(res.data.order))
      .catch((err) => setError(err.response?.data?.message || "Could not load order."))
      .finally(() => setLoading(false));
  }, [id]);

  let content;

  if (loading) {
    content = <p className="text-center text-gray-600 py-20">Loading...</p>;
  } else if (error) {
    content = <p className="text-center text-red-600 py-20">{error}</p>;
  } else {
    content = (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h1 className="text-2xl font-extrabold text-gray-900">
          {success ? "✅ Order Placed Successfully" : "Order Details"}
        </h1>

        <div className="text-sm text-gray-700 space-y-1">
          <p>Order ID: <span className="font-mono">{order._id}</span></p>
          <p>Total: <span className="font-bold">₹{order.totalAmount.toLocaleString("en-IN")}</span></p>
          <p>Status: {order.status}</p>
          <p>Payment: {order.paymentStatus}</p>
        </div>

        <div>
          <h2 className="font-bold text-gray-900 mb-2">Items</h2>
          <div className="text-sm text-gray-700 space-y-1">
            {order.items.map((i) => (
              <div key={i._id} className="flex justify-between">
                <span>{i.name} × {i.quantity}</span>
                <span>₹{(i.price * i.quantity).toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-bold text-gray-900 mb-2">Shipping To</h2>
          <p className="text-sm text-gray-700">
            {order.shippingAddress.fullName}, {order.shippingAddress.phone}
            <br />
            {order.shippingAddress.addressLine1}, {order.shippingAddress.city},{" "}
            {order.shippingAddress.state} - {order.shippingAddress.pincode}
          </p>
        </div>

        <div className="flex gap-4 pt-2">
          <Link
            to="/orders"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl"
          >
            View My Orders
          </Link>
          <Link
            to="/products"
            className="px-5 py-2.5 border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">{content}</main>
    </div>
  );
}