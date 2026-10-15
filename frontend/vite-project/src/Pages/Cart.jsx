import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import CartItem from "../components/CartItem";
import { useCart } from "../Context/CartContext";

function Cart() {
    const navigate = useNavigate();
    const {
        cartItems,
        loading,
        error,
        pendingIds,
        totalItems,
        subtotal,
        refreshCart,
        updateQuantity,
        removeFromCart,
    } = useCart();

    const [actionError, setActionError] = useState("");

    const formatPrice = (price) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price);

    const handleUpdate = async (productId, newQty) => {
        setActionError("");
        const result = await updateQuantity(productId, newQty);
        if (!result.ok) setActionError(result.message);
    };

    const handleRemove = async (productId) => {
        setActionError("");
        const result = await removeFromCart(productId);
        if (!result.ok) setActionError(result.message);
    };

    let content;

    if (loading) {
        content = (
            <p className="text-center text-gray-600 py-20">Loading your cart...</p>
        );
    } else if (error) {
        content = (
            <div className="text-center py-20">
                <h2 className="text-xl font-bold text-gray-900">{error}</h2>
                <button
                    onClick={refreshCart}
                    className="mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl"
                >
                    Try Again
                </button>
            </div>
        );
    } else if (cartItems.length === 0) {
        content = (
            <div className="text-center py-20">
                <div className="text-5xl">🛒</div>
                <h2 className="mt-4 text-xl font-bold text-gray-900">Your cart is empty</h2>
                <p className="mt-1 text-gray-500">
                    Looks like you haven't added anything yet.
                </p>
                <button
                    onClick={() => navigate("/products")}
                    className="mt-5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl"
                >
                    Browse Products
                </button>
            </div>
        );
    } else {
        content = (
            <>
                {actionError && (
                    <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                        {actionError}
                    </p>
                )}

                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <CartItem
                                key={item.product._id}
                                item={item}
                                busy={pendingIds.includes(item.product._id)}
                                onIncrease={() => handleUpdate(item.product._id, item.quantity + 1)}
                                onDecrease={() => handleUpdate(item.product._id, item.quantity - 1)}
                                onRemove={() => handleRemove(item.product._id)}
                            />
                        ))}
                    </div>

                    <aside className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-fit lg:sticky lg:top-24">
                        <h2 className="text-lg font-bold text-gray-900">Order Summary</h2>

                        <div className="mt-4 space-y-2 text-sm text-gray-700">
                            <div className="flex justify-between">
                                <span>Items</span>
                                <span className="font-semibold">{totalItems}</span>
                            </div>
                            <div className="flex justify-between border-t border-gray-100 pt-3 text-base">
                                <span className="font-semibold text-gray-900">Subtotal</span>
                                <span className="font-extrabold text-gray-900">
                                    {formatPrice(subtotal)}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate("/checkout")}
                            className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm"
                        >
                            Proceed to Checkout
                        </button>
                        <Link
                            to="/products"
                            className="mt-3 block text-center text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                            Continue Shopping
                        </Link>
                    </aside>
                </div>
            </>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <NavBar />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Cart</h1>
                </div>
                {content}
            </main>
        </div>
    );
}

export default Cart;
