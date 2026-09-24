import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Home from "./Pages/Home";
import Products from "./Pages/Products";
import ProductDetails from "./Pages/ProductDetails";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Default redirect to /home (which redirects to /login if unauthenticated) */}
                <Route
                    path="/"
                    element={<Navigate to="/home" replace />}
                />

                {/* Authentication Routes */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Protected Home Dashboard */}
                <Route
                    path="/home"
                    element={<Home />}
                />

                {/* Product Discovery Routes */}
                <Route
                    path="/products"
                    element={<Products />}
                />

                <Route
                    path="/products/:id"
                    element={<ProductDetails />}
                />

                {/* Catch-all fallback */}
                <Route
                    path="*"
                    element={<Navigate to="/home" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;