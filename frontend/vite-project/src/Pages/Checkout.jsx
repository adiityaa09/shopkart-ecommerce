import { useState, useRef } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useCart } from "../Context/CartContext";
import { createPaymentOrder, verifyPayment } from "../Services/api";

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const validate = (f) => {
  const e = {};
  if (!f.fullName.trim()) e.fullName = "Full name is required.";
  if (!/^[6-9]\d{9}$/.test(f.phone.trim())) e.phone = "Enter a valid 10-digit phone number.";
  if (!f.addressLine1.trim()) e.addressLine1 = "Address is required.";
  if (!f.city.trim()) e.city = "City is required.";
  if (!f.state.trim()) e.state = "State is required.";
  if (!/^\d{6}$/.test(f.pincode.trim())) e.pincode = "Pincode must contain 6 digits.";
  return e;
};

export default function Checkout() {
  const { cartItems, subtotal, refreshCart } = useCart();
  const navigate = useNavigate();
  const paidRef = useRef(false);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  if (!paidRef.current && (!cartItems || cartItems.length === 0)) {
    return <Navigate to="/cart" replace />;
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handlePay = async (e) => {
    e.preventDefault();
    setServerError("");

    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return; // no backend call if invalid

    setLoading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Could not load Razorpay. Check your internet connection.");

      const { data } = await createPaymentOrder(form);

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "ShopKart",
        description: "ShopKart Order",
        order_id: data.razorpayOrderId,
        handler: async (response) => {
          try {
            const res = await verifyPayment({
              shopKartOrderId: data.shopKartOrderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            paidRef.current = true;
            await refreshCart(); // cart is now empty on server -> navbar shows 0
            navigate(`/order-success/${res.data.order._id}`, { replace: true });
          } catch (err) {
            setServerError(err.response?.data?.message || "Payment verification failed.");
            setLoading(false);
          }
        },
        prefill: { name: form.fullName, contact: form.phone },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => {
        setServerError("Payment failed. Your cart has not been cleared. Please try again.");
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      setServerError(err.response?.data?.message || err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  const field = (name, label) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        name={name}
        value={form[name]}
        onChange={handleChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NavBar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Checkout</h1>

        <form onSubmit={handlePay} className="grid lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-900">Shipping Details</h2>
            {field("fullName", "Full Name")}
            {field("phone", "Phone")}
            {field("addressLine1", "Address")}
            <div className="grid sm:grid-cols-3 gap-4">
              {field("city", "City")}
              {field("state", "State")}
              {field("pincode", "Pincode")}
            </div>
          </section>

          <aside className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-fit">
            <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              {cartItems.map((item) => (
                <div key={item.product._id} className="flex justify-between">
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <span>₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
              <div className="flex justify-between border-t border-gray-100 pt-3 text-base font-bold text-gray-900">
                <span>Total</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {serverError && (
              <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl"
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </aside>
        </form>
      </main>
    </div>
  );
}