import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import {
    addToCartApi,
    getCartApi,
    updateCartQuantityApi,
    removeFromCartApi,
} from "../Services/api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pendingIds, setPendingIds] = useState([]); // product ids with a request running

    // ---------- load from backend ----------
    const refreshCart = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getCartApi();
            setCartItems(data.cart);
        } catch (err) {
            if (err.response?.status === 401) {
                setCartItems([]); // not logged in: not an error, just no cart
            } else {
                setError("Unable to load your cart.");
            }
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    // ---------- helper for every mutation ----------
    const runMutation = async (productId, apiCall) => {
        setPendingIds((prev) => [...prev, productId]);
        try {
            const { data } = await apiCall();
            setCartItems(data.cart); // backend returns the updated cart
            return { ok: true };
        } catch (err) {
            return {
                ok: false,
                message: err.response?.data?.message || "Something went wrong. Please try again.",
            };
        } finally {
            setPendingIds((prev) => prev.filter((id) => id !== productId));
        }
    };

    const addToCart = (productId) => runMutation(productId, () => addToCartApi(productId));
    const updateQuantity = (productId, quantity) =>
        runMutation(productId, () => updateCartQuantityApi(productId, quantity));
    const removeFromCart = (productId) => runMutation(productId, () => removeFromCartApi(productId));

    const clearCart = () => setCartItems([]); // call on logout

    // ---------- derived values (never stored) ----------
    const totalItems = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
        [cartItems]
    );
    const subtotal = useMemo(
        () => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
        [cartItems]
    );

    const value = {
        cartItems,
        loading,
        error,
        pendingIds,
        totalItems,
        subtotal,
        refreshCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
    return ctx;
}