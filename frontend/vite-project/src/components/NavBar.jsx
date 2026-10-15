import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../Services/api";
import { useCart } from "../Context/CartContext";

function NavBar({ user = null }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [loggingOut, setLoggingOut] = useState(false);
    const { totalItems, clearCart } = useCart();

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await api.post("/customers/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setLoggingOut(false);
            clearCart(); // so the next user doesn't see this cart
            navigate("/login");
        }
    };

    const isActive = (path) => location.pathname === path;

    const desktopLink = (path) =>
        `px-3 py-2 rounded-lg text-sm font-semibold transition ${
            isActive(path)
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        }`;

    const mobileLink = (path) =>
        `text-xs font-semibold px-3 py-1.5 rounded-md ${
            isActive(path) ? "bg-blue-100 text-blue-700" : "text-gray-600"
        }`;

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <Link to="/home" className="flex items-center gap-2 text-2xl font-black tracking-tight text-blue-600 hover:text-blue-700 transition">
                            <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">🛒</span>
                            <span>ShopKart</span>
                        </Link>

                        <nav className="hidden md:flex items-center space-x-1">
                            <Link to="/home" className={desktopLink("/home")}>Home</Link>
                            <Link to="/products" className={desktopLink("/products")}>Products</Link>
                            <Link to="/wishlist" className={desktopLink("/wishlist")}>Wishlist</Link>
                            <Link to="/cart" className={desktopLink("/cart")}>Cart ({totalItems})</Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        {user && (
                            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                <span>{user.fullName || user.email}</span>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer"
                        >
                            {loggingOut ? "Logging out..." : "Logout"}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile navigation bar */}
            <div className="md:hidden border-t border-gray-100 px-4 py-2 flex items-center justify-around bg-gray-50/50">
                <Link to="/home" className={mobileLink("/home")}>Home</Link>
                <Link to="/products" className={mobileLink("/products")}>Products</Link>
                <Link to="/wishlist" className={mobileLink("/wishlist")}>Wishlist</Link>
                <Link to="/cart" className={mobileLink("/cart")}>Cart ({totalItems})</Link>
            </div>
        </header>
    );
}

export default NavBar;