import { useState, useEffect } from "react";
import api from "../Services/api";
import NavBar from "../components/NavBar";
import ProductCard from "../components/ProductCard";
import SearchBar from "../components/SearchBar";

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
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

        const params = {};
        if (searchTerm.trim()) {
            params.search = searchTerm.trim();
        }
        if (selectedCategory.trim()) {
            params.category = selectedCategory.trim();
        }

        api.get("/products", { params })
            .then((response) => {
                if (isMounted) {
                    setProducts(response.data.products || []);
                }
            })
            .catch((err) => {
                console.error("Error loading products:", err);
                if (isMounted) {
                    setError("Something went wrong while loading products.");
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
    }, [searchTerm, selectedCategory]);

    const handleClearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <NavBar user={currentUser} />

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Title & Subtitle */}
                <div className="mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Product Catalogue
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Explore high quality products across our curated categories.
                    </p>
                </div>

                {/* Search & Filter Bar */}
                <SearchBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    categories={["All Categories", "Electronics", "Fashion", "Books", "Home"]}
                    onClear={handleClearFilters}
                />

                {/* State Handling: Loading, Error, Empty, Success */}
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-lg font-semibold text-gray-700">Loading products...</p>
                        <p className="text-xs text-gray-400 mt-1">Fetching latest catalogue from server</p>
                    </div>
                ) : error ? (
                    <div className="py-16 bg-white rounded-2xl border border-red-200 p-8 text-center max-w-md mx-auto shadow-sm">
                        <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3 text-2xl font-bold">
                            ✕
                        </div>
                        <h3 className="text-base font-bold text-gray-900 mb-1">
                            Something went wrong while loading products.
                        </h3>
                        <p className="text-xs text-gray-500 mb-4">
                            Please check your network connection or backend server.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setLoading(true);
                                setError("");
                                api.get("/products", {
                                    params: {
                                        ...(searchTerm && { search: searchTerm }),
                                        ...(selectedCategory && { category: selectedCategory })
                                    }
                                })
                                    .then((res) => setProducts(res.data.products || []))
                                    .catch(() => setError("Something went wrong while loading products."))
                                    .finally(() => setLoading(false));
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition"
                        >
                            Try Again
                        </button>
                    </div>
                ) : products.length === 0 ? (
                    <div className="py-16 bg-white rounded-2xl border border-gray-200/80 p-8 text-center max-w-md mx-auto shadow-sm">
                        <div className="text-4xl mb-3">🔍</div>
                        <h3 className="text-lg font-bold text-gray-800">No products found.</h3>
                        <p className="text-xs text-gray-500 mt-1 mb-4">
                            We couldn't find any products matching your search or category filter.
                        </p>
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition"
                        >
                            Reset Search & Filters
                        </button>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Showing {products.length} {products.length === 1 ? "product" : "products"}
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Products;
