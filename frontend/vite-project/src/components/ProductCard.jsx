import { Link } from "react-router-dom";

function ProductCard({ product }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0
        }).format(price);
    };

    const isOutOfStock = product.stock <= 0;

    return (
        <div className="group bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md hover:border-blue-200 transition flex flex-col overflow-hidden">
            {/* Image Container */}
            <div className="relative aspect-square w-full bg-gray-100 overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=600&q=80";
                    }}
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                    {product.category}
                </span>
                {isOutOfStock && (
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                        Out of Stock
                    </span>
                )}
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-blue-600 transition">
                        {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                        {product.category}
                    </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-baseline justify-between mb-3">
                        <span className="text-xl font-extrabold text-gray-900">
                            {formatPrice(product.price)}
                        </span>
                        <span className={`text-xs font-medium ${isOutOfStock ? "text-red-500" : "text-emerald-600 font-semibold"}`}>
                            {isOutOfStock ? "Out of Stock" : `${product.stock} units left`}
                        </span>
                    </div>

                    <Link
                        to={`/products/${product._id}`}
                        className="w-full block text-center py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition shadow-sm hover:shadow"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ProductCard;
