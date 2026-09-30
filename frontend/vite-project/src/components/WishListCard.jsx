import { Link } from "react-router-dom";

function WishlistCard({ product, onRemove, removing }) {
  return (
    <div className="wishlist-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.category}</p>
      <p>₹{product.price.toLocaleString("en-IN")}</p>
      <p>{product.stock > 0 ? `${product.stock} units left` : "Out of stock"}</p>

      <Link to={`/products/${product._id}`}>View Details</Link>

      <button onClick={() => onRemove(product._id)} disabled={removing}>
        {removing ? "Removing..." : "Remove ♥"}
      </button>
    </div>
  );
}

export default WishlistCard;