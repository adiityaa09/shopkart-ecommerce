import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { getWishlist, removeFromWishlist } from "../Services/api";
import NavBar from "../components/NavBar";
import WishlistCard from "../components/WishListCard";

function Wishlist() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [removingId, setRemovingId] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let isMounted = true;

        async function fetchWishlist() {
            try {
                const { data } = await getWishlist();
                if (isMounted) {
                    setProducts(data.wishlist || []);
                }
            } catch (requestError) {
                if (requestError.response?.status === 401) {
                    navigate("/login", { replace: true });
                    return;
                }
                if (isMounted) {
                    setError("Could not load your wishlist. Please try again.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        api.get("/customers/me")
            .then((response) => {
                if (isMounted) {
                    setUser(response.data);
                }
            })
            .catch(() => {
                if (isMounted) {
                    setUser(null);
                }
            });

        fetchWishlist();

        return () => {
            isMounted = false;
        };
    }, [navigate, reloadKey]);

    async function handleRemove(productId) {
        setRemovingId(productId);
        setError("");
        try {
            await removeFromWishlist(productId);
            setProducts((currentProducts) =>
                currentProducts.filter((product) => product._id !== productId)
            );
        } catch (requestError) {
            if (requestError.response?.status === 401) {
                navigate("/login", { replace: true });
            } else {
                setError("Could not remove this product. Please try again.");
            }
        } finally {
            setRemovingId(null);
        }
    }

    function handleRetry() {
        setError("");
        setLoading(true);
        setReloadKey((currentKey) => currentKey + 1);
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <NavBar user={user} />
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Your Wishlist
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Products you have saved for later.
                    </p>
                </div>

                {loading ? (
                    <div className="py-20 text-center text-gray-600">Loading wishlist...</div>
                ) : error ? (
                    <div className="py-12 text-center">
                        <p className="text-sm text-red-600 mb-4">{error}</p>
                        <button
                            type="button"
                            onClick={handleRetry}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
                        >
                            Try Again
                        </button>
                    </div>
                ) : products.length === 0 ? (
                    <div className="py-16 text-center bg-white border border-gray-200 rounded-xl">
                        <h2 className="text-lg font-semibold text-gray-800">Your wishlist is empty</h2>
                        <p className="text-sm text-gray-500 mt-2">
                            Save products from the catalogue and they will appear here.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <WishlistCard
                                key={product._id}
                                product={product}
                                onRemove={handleRemove}
                                removing={removingId === product._id}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Wishlist;