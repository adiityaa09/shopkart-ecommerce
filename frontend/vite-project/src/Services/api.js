import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8083",
    withCredentials: true,
});

export const addToWishlist = (productId) => api.post(`/wishlist/${productId}`);
export const getWishlist = () => api.get("/wishlist");
export const removeFromWishlist = (productId) => api.delete(`/wishlist/${productId}`);

export default api;