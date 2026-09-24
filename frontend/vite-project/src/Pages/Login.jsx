import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../Services/api";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {

            const response = await api.post(
                "/customers/login",
                formData
            );

            setMessage(response.data.message || "Login successful!");

            setTimeout(() => {
                navigate("/home");
            }, 500);

        } catch (error) {

            setMessage(
                error.response?.data?.message ||
                "Login failed"
            );

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                <h1 className="text-3xl font-bold text-center text-gray-800">
                    Welcome Back
                </h1>

                <p className="text-center text-gray-500 mt-2">
                    Login to your ShopKart account
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {message && (
                        <p className="text-center text-sm text-red-600">
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <p className="text-center text-gray-600 mt-6">
                    Don't have an account?{" "}

                    <Link
                        to="/register"
                        className="text-blue-600 font-semibold hover:underline"
                    >
                        Register
                    </Link>
                </p>

            </div>

        </div>
    );
}

export default Login;