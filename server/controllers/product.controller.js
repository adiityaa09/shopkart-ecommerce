import mongoose from "mongoose";
import Product from "../models/product.model.js";


const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image, stock } = req.body;

        if (
            name === undefined ||
            description === undefined ||
            price === undefined ||
            category === undefined ||
            image === undefined ||
            stock === undefined ||
            name === "" ||
            description === "" ||
            category === "" ||
            image === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields (name, description, price, category, image, stock) are required"
            });
        }

        const numericPrice = Number(price);
        const numericStock = Number(stock);

        if (isNaN(numericPrice) || numericPrice <= 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be a valid number greater than 0"
            });
        }

        if (isNaN(numericStock) || numericStock < 0) {
            return res.status(400).json({
                success: false,
                message: "Stock cannot be negative"
            });
        }

        const product = await Product.create({
            name: name.trim(),
            description: description.trim(),
            price: numericPrice,
            category: category.trim(),
            image: image.trim(),
            stock: numericStock
        });

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });
    } catch (error) {
        console.error("Error creating product:", error);
        return res.status(400).json({
            success: false,
            message: error.message || "Failed to create product"
        });
    }
};

const getAllProducts = async (req, res) => {
    try {
        const { search, category } = req.query;

        const query = {};

        if (search && search.trim() !== "") {
            query.name = { $regex: search.trim(), $options: "i" };
        }

        if (category && category.trim() !== "" && category.trim().toLowerCase() !== "all") {
            query.category = { $regex: `^${category.trim()}$`, $options: "i" };
        }

        const products = await Product.find(query).select(
            "_id name description price category image stock createdAt"
        );

        return res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch products"
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch product"
        });
    }
};

export {
    createProduct,
    getAllProducts,
    getProductById
};
