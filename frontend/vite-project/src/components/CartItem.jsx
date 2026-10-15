import { Link } from "react-router-dom";

function CartItem({ item, busy, onIncrease, onDecrease, onRemove }) {
    const { product, quantity } = item;

    const formatPrice = (price) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(price);

    const atMax = quantity >= product.stock;
    const atMin = quantity <= 1;

    return (
        <div className="flex gap-4 bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <Link to={`/products/${product._id}`} className="shrink-0">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover bg-gray-100"
                />
            </Link>

            <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                    <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mt-0.5">
                        {product.category}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">{formatPrice(product.price)} each</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
                    <div className="inline-flex items-center border border-gray-300 rounded-lg overflow-hidden">
                        <button
                            onClick={onDecrease}
                            disabled={busy || atMin}
                            className="px-3 py-1.5 text-lg font-semibold hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>
                        <span className="px-4 py-1.5 text-sm font-semibold min-w-[2.5rem] text-center">
                            {quantity}
                        </span>
                        <button
                            onClick={onIncrease}
                            disabled={busy || atMax}
                            className="px-3 py-1.5 text-lg font-semibold hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                    </div>

                    <span className="text-lg font-extrabold text-gray-900">
                        {formatPrice(product.price * quantity)}
                    </span>
                </div>

                <div className="flex items-center justify-between mt-2">
                    <button
                        onClick={onRemove}
                        disabled={busy}
                        className="text-sm font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
                    >
                        {busy ? "Updating..." : "Remove"}
                    </button>
                    {atMax && <span className="text-xs text-amber-600">Max stock reached</span>}
                </div>
            </div>
        </div>
    );
}

export default CartItem;