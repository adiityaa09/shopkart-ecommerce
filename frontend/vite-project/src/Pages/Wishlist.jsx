import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import WishListCard from "../components/WishListCard";
import { getWishlist, removeFromWishlist } from "../Services/api";

function Wishlist() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [status, setStatus] = useState("loading"); // loading | error | success
    const [removingId, setRemovingId] = useState(null);
    const [removeError, setRemoveError] = useState("");

    const loadWishlist = async () => {
        setStatus("loading");
        try {
            const { data } = await getWishlist();
            setProducts(data.wishlist);
            setStatus("success");
        } catch (err) {
            if (err.response?.status === 401) {
                navigate("/login");
                return;
            }
            setStatus("error");
        }
    };

    useEffect(() => {
        loadWishlist();
    }, []);

    const handleRemove = async (productId) => {
        setRemovingId(productId);
        setRemoveError("");
        try {
            await removeFromWishlist(productId);
            setProducts((prev) => prev.filter((p) => p._id !== productId));
        } catch (err) {
            setRemoveError("Couldn't remove that product. Please try again.");
        } finally {
            setRemovingId(null);
        }
    };

    let content;

    if (status === "loading") {
        content = <p className="text-center text-gray-600 py-20">Loading your wishlist...</p>;
    } else if (status === "error") {
        content = (
            <div className="text-center py-20">
                <h2 className="text-xl font-bold text-gray-900">Something went wrong.</h2>
                <p className="mt-1 text-gray-500">We couldn't load your wishlist.</p>
                <button
                    onClick={loadWishlist}
                    className="mt-4 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl"
                >
                    Try Again
                </button>
            </div>
        );
    } else if (products.length === 0) {
        content = (
            <div className="text-center py-20">
                <div className="text-5xl">❤️</div>
                <h2 className="mt-4 text-xl font-bold text-gray-900">Your wishlist is empty</h2>
                <p className="mt-1 text-gray-500">Save products you love and find them here later.</p>
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
                <p className="text-sm text-gray-500 mb-4">
                    {products.length} product{products.length !== 1 && "s"} saved
                </p>

                {removeError && (
                    <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
                        {removeError}
                    </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <WishListCard
                            key={product._id}
                            product={product}
                            onRemove={handleRemove}
                            removing={removingId === product._id}
                        />
                    ))}
                </div>

                <Link to="/products" className="inline-block mt-8 text-sm font-semibold text-blue-600 hover:text-blue-700">
                    Continue Shopping
                </Link>
            </>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <NavBar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-black text-gray-900">My Wishlist</h1>
                <div className="mt-4">{content}</div>
            </main>
        </div>
    );
}

export default Wishlist;