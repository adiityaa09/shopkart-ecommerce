import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../Services/api";
import NavBar from "../components/NavBar";

function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function fetchUserProfile() {
            try {
                const response = await api.get("/customers/me");
                if (isMounted) {
                    setUser(response.data);
                }
            } catch (error) {
                console.error("Auth verification failed:", error);
                if (isMounted) {
                    // Redirect to login if unauthorized
                    navigate("/login", { replace: true });
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchUserProfile();

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium text-sm">Verifying session...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <NavBar user={user} />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Welcome Hero Banner */}
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 rounded-3xl p-8 sm:p-10 text-white shadow-xl mb-10 relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl">
                        <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
                            Customer Portal
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                            Welcome back, {user.fullName}! 👋
                        </h1>
                        <p className="mt-3 text-blue-100 text-base sm:text-lg leading-relaxed">
                            Discover the latest additions to the ShopKart catalogue, track your account, and enjoy seamless shopping today.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                to="/products"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-bold rounded-xl shadow hover:bg-blue-50 transition transform hover:-translate-y-0.5"
                            >
                                <span>🛒</span>
                                <span>Explore Products</span>
                            </Link>
                        </div>
                    </div>
                    {/* Decorative background shape */}
                    <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* User Profile Card (Shadcn UI style) */}
                    <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-md">
                                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">{user.fullName}</h2>
                                    <p className="text-xs text-gray-500 font-medium mt-0.5">Verified Customer</p>
                                    <span className="inline-flex items-center px-2 py-0.5 mt-1.5 rounded text-xs font-semibold bg-green-100 text-green-800">
                                        ● Active Account
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                <div>
                                    <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                                        Customer Name
                                    </label>
                                    <p className="text-sm font-semibold text-gray-800 mt-1">{user.fullName}</p>
                                </div>

                                <div>
                                    <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                                        Email Address
                                    </label>
                                    <p className="text-sm font-semibold text-gray-800 mt-1 break-all">{user.email}</p>
                                </div>

                                <div>
                                    <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold">
                                        Phone Number
                                    </label>
                                    <p className="text-sm font-semibold text-gray-800 mt-1">{user.phone}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-gray-100">
                            <Link
                                to="/products"
                                className="w-full block text-center py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold rounded-xl transition"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Quick Stats & Features */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
                                <div className="text-2xl mb-1">🛍️</div>
                                <div className="text-2xl font-bold text-gray-900">0</div>
                                <div className="text-xs text-gray-500 font-medium">Items in Cart</div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
                                <div className="text-2xl mb-1">📦</div>
                                <div className="text-2xl font-bold text-gray-900">0</div>
                                <div className="text-xs text-gray-500 font-medium">Past Orders</div>
                            </div>

                            <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
                                <div className="text-2xl mb-1">✨</div>
                                <div className="text-2xl font-bold text-gray-900">100</div>
                                <div className="text-xs text-gray-500 font-medium">Reward Points</div>
                            </div>
                        </div>

                        {/* Discovery Feature Card */}
                        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Product Discovery</h3>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Browse our brand new product catalogue with live search, category filters, and detailed specs.
                                    </p>
                                </div>
                                <Link
                                    to="/products"
                                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow transition shrink-0"
                                >
                                    Browse Catalogue →
                                </Link>
                            </div>
                        </div>

                        {/* Recent Activity / Information Card */}
                        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm">
                            <h3 className="text-base font-bold text-gray-900 mb-3">Security & Account Status</h3>
                            <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
                                <span className="text-lg">🔒</span>
                                <div>
                                    <p className="font-semibold text-gray-800">Session Authenticated</p>
                                    <p className="text-xs text-gray-500">Your session is protected via secure HTTP cookies.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Home;