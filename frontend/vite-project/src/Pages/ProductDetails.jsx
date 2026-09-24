import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../Services/api";
import NavBar from "../components/NavBar";

function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [addedToast, setAddedToast] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        api.get("/customers/me")
            .then((res) => setCurrentUser(res.data))
            .catch(() => setCurrentUser(null));
    }, []);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setError("");

        api.get(`/products/${id}`)
            .then((response) => {
                if (isMounted) {
                    setProduct(response.data.product || response.data);
                }
            })
            .catch((err) => {
                console.error("Error fetching product details:", err);
                if (isMounted) {
                    setError(
                        err.response?.data?.message ||
                        "Product not found or failed to load product details."
                    );
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [id]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(price);
    };

    const handleAddToCart = () => {
        setAddedToast(true);
        setTimeout(() => {
            setAddedToast(false);
        }, 2500);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <NavBar user={currentUser} />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Breadcrumb Navigation */}
                <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                    <Link to="/products" className="hover:text-blue-600 transition font-medium flex items-center gap-1">
                        <span>←</span>
                        <span>Back to Products</span>
                    </Link>
                    {product && (
                        <>
                            <span>/</span>
                            <span className="text-gray-400">{product.category}</span>
                            <span>/</span>
                            <span className="text-gray-800 font-semibold truncate max-w-xs">{product.name}</span>
                        </>
                    )}
                </div>

                {loading ? (
                    <div className="py-24 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-lg font-semibold text-gray-700">Loading product details...</p>
                    </div>
                ) : error || !product ? (
                    <div className="py-16 bg-white rounded-3xl border border-gray-200 p-8 text-center max-w-md mx-auto shadow-sm">
                        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                            ✕
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 mb-2">Product Not Found</h2>
                        <p className="text-sm text-gray-500 mb-6">
                            {error || "The requested product does not exist or may have been removed."}
                        </p>
                        <Link
                            to="/products"
                            className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition"
                        >
                            Return to Catalogue
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden p-6 sm:p-10">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                            {/* Left: Large Product Image */}
                            <div className="space-y-4">
                                <div className="aspect-square w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 flex items-center justify-center shadow-inner">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover object-center"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=800&q=80";
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Right: Product Details */}
                            <div className="flex flex-col justify-between">
                                <div>
                                    {/* Category & Stock Pill */}
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-full">
                                            {product.category}
                                        </span>
                                        <span
                                            className={`text-xs font-semibold px-3 py-1 rounded-full ${
                                                product.stock > 0
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "bg-red-50 text-red-600"
                                            }`}
                                        >
                                            {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
                                        </span>
                                    </div>

                                    {/* Name */}
                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-4">
                                        {product.name}
                                    </h1>

                                    {/* Price */}
                                    <div className="text-3xl font-black text-blue-600 mb-6">
                                        {formatPrice(product.price)}
                                    </div>

                                    {/* Description */}
                                    <div className="border-t border-b border-gray-100 py-5 mb-6">
                                        <h3 className="text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">
                                            Product Description
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                                            {product.description}
                                        </p>
                                    </div>

                                    {/* Quantity Selection (UI) */}
                                    {product.stock > 0 && (
                                        <div className="flex items-center gap-4 mb-6">
                                            <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                                            <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden">
                                                <button
                                                    type="button"
                                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                    disabled={quantity <= 1}
                                                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 disabled:opacity-40 transition font-bold"
                                                >
                                                    -
                                                </button>
                                                <span className="px-4 py-1.5 text-sm font-semibold text-gray-900 bg-white min-w-[2.5rem] text-center">
                                                    {quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                                    disabled={quantity >= product.stock}
                                                    className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 disabled:opacity-40 transition font-bold"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Add to Cart Button */}
                                    <div className="space-y-3">
                                        <button
                                            type="button"
                                            onClick={handleAddToCart}
                                            disabled={product.stock <= 0}
                                            className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition transform active:scale-[0.99] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-base cursor-pointer"
                                        >
                                            <span>🛒</span>
                                            <span>{product.stock > 0 ? "Add to Cart" : "Out of Stock"}</span>
                                        </button>

                                        {addedToast && (
                                            <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-800 text-xs font-semibold text-center animate-fade-in">
                                                ✓ Added {quantity} item(s) to Cart! (UI Demo)
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Value Props / Trust badges */}
                                <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 text-xs text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <span className="text-base">🚚</span>
                                        <span>Fast Dispatch & Delivery</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-base">🛡️</span>
                                        <span>7-Day Return Guarantee</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default ProductDetails;
