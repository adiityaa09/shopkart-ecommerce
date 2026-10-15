import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { CartProvider } from "./Context/CartContext";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import ProductDetails from "./Pages/ProductDetails";
import Wishlist from "./Pages/Wishlist";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import Orders from "./Pages/Orders";
import OrderDetails from "./Pages/OrderDetails";

function App() {
    return (
        <BrowserRouter>
            <CartProvider>
                <Routes>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:id" element={<ProductDetails />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="*" element={<Navigate to="/home" replace />} />

                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orders/:id" element={<OrderDetails />} />
                    <Route path="/order-success/:id" element={<OrderDetails success />} />
                </Routes>
            </CartProvider>
        </BrowserRouter>
    );
}

export default App;