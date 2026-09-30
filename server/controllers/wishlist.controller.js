import mongoose from "mongoose";
import Product from "../models/product.model.js";

export const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        const customer = req.user;

        const alreadySaved = customer.wishlist.some((id) => id.equals(productId));
        if (alreadySaved) {
            return res.status(409).json({ success: false, message: "Product already in wishlist" });
        }

        
        customer.wishlist.push(productId);
        await customer.save();

        return res.status(201).json({ success: true, message: "Product added to wishlist" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

export const getWishlist = async (req, res) => {
    try {
        await req.user.populate({
            path: "wishlist",
            select: "name price image category stock"
        })

        return res.status(200).json({
            success: true,
            count: req.user.wishlist.length,
            wishlist: req.user.wishlist,
        })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Server error' })
    }
}

export const removeFromWishlist = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({ success: false, message: "Invalid product ID" });
        }

        const customer = req.user;

        const isSaved = customer.wishlist.some((id) => id.equals(productId));
        if (!isSaved) {
            return res.status(404).json({ success: false, message: "Product not in wishlist" });
        }

        customer.wishlist.pull(productId);
        await customer.save();

        return res.status(200).json({ success: true, message: "Product removed from wishlist" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};