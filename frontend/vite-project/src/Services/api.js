import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8083",
    withCredentials: true,
});

export const addToWishlist = (productId) => api.post(`/wishlist/${productId}`);
export const getWishlist = () => api.get("/wishlist");
export const removeFromWishlist = (productId) => api.delete(`/wishlist/${productId}`);

export const addToCartApi = (productId) => api.post(`/cart/${productId}`);
export const getCartApi = () => api.get("/cart");
export const updateCartQuantityApi = (productId, quantity) =>
    api.patch(`/cart/${productId}`, { quantity });
export const removeFromCartApi = (productId) => api.delete(`/cart/${productId}`);


export const createPaymentOrder = (shippingAddress) =>
  api.post("/orders/create-payment-order", { shippingAddress });

export const verifyPayment = (payload) => api.post("/orders/verify-payment", payload);

export const getMyOrders = () => api.get("/orders");

export const getOrderById = (id) => api.get(`/orders/${id}`);
export default api;