import { Link } from "react-router-dom";

function WishlistCard({ product, onRemove, removing }) {
    const formatPrice = (price) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price);

    const outOfStock = product.stock <= 0;

    return (
        <div className="group bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition flex flex-col overflow-hidden">
            <div className="aspect-square w-full bg-gray-100 overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
            </div>

            <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 line-clamp-1">{product.name}</h3>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">
                    {product.category}
                </p>

                <div className="flex items-baseline justify-between mt-4">
                    <span className="text-xl font-extrabold text-gray-900">
                        {formatPrice(product.price)}
                    </span>
                    <span className={`text-xs font-semibold ${outOfStock ? "text-red-500" : "text-emerald-600"}`}>
                        {outOfStock ? "Out of Stock" : `${product.stock} units left`}
                    </span>
                </div>

                <Link
                    to={`/products/${product._id}`}
                    className="mt-4 block text-center py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition"
                >
                    View Details
                </Link>

                <button
                    onClick={() => onRemove(product._id)}
                    disabled={removing}
                    className="mt-2 w-full py-2.5 text-sm font-semibold rounded-xl border border-pink-200 text-pink-600 bg-pink-50 hover:bg-pink-100 transition disabled:opacity-60"
                >
                    {removing ? "Removing..." : "Remove ♥"}
                </button>
            </div>
        </div>
    );
}

export default WishlistCard;