import mongoose from "mongoose";
import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.params

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ success: false, message: 'Invalid Product ID' })
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const customer = req.user

        const existingItem = customer.cart.find((item) => item.product.equals(productId))
        const newQuantity = existingItem ? existingItem.quantity + 1 : 1;
        if (newQuantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.stock} unit(s) available`,
            });
        }

        if (existingItem) {
            existingItem.quantity = newQuantity;
        } else {
            customer.cart.push({ product: productId, quantity: 1 });
        }

        await customer.save();
        await customer.populate("cart.product", "name price category image stock");

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: customer.cart,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getCart = async (req, res) => {
    try {
        await req.user.populate("cart.product", "name price category image stock");

        const cart = req.user.cart.filter((item) => item.product !== null);

        return res.status(200).json({
            success: true,
            cart,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({ success: false, message: "Quantity must be a positive integer" });
        }

        const customer = req.user;
        const cartItem = customer.cart.find((item) => item.product.equals(productId));

        if (!cartItem) {
            return res.status(404).json({ success: false, message: "Product not in cart" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: `Only ${product.stock} unit(s) available`,
            });
        }

        cartItem.quantity = quantity;
        await customer.save();
        await customer.populate("cart.product", "name price category image stock");

        return res.status(200).json({
            success: true,
            message: "Cart updated",
            cart: customer.cart.filter((item) => item.product !== null),
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }

        const customer = req.user;

        const isInCart = customer.cart.some((item) => item.product.equals(productId));
        if (!isInCart) {
            return res.status(404).json({ success: false, message: "Product not in cart" });
        }

        customer.cart = customer.cart.filter((item) => !item.product.equals(productId));
        await customer.save();

        await customer.populate("cart.product", "name price category image stock");

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            cart: customer.cart.filter((item) => item.product !== null),
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};