import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/product.model.js";

dotenv.config();

const sampleProducts = [
    {
        name: "Mechanical Keyboard",
        description: "RGB mechanical keyboard with blue switches, tactile feedback, and durable aluminum frame.",
        price: 2999,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
        stock: 10
    },
    {
        name: "Noise Cancelling Headphones",
        description: "Wireless over-ear headphones with active noise cancellation, deep bass, and 30-hour battery life.",
        price: 4999,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
        stock: 25
    },
    {
        name: "Ergonomic Gaming Mouse",
        description: "High-precision optical gaming mouse with customizable DPI, RGB lighting, and programmable buttons.",
        price: 1499,
        category: "Electronics",
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
        stock: 18
    },
    {
        name: "Classic Denim Jacket",
        description: "Premium cotton denim jacket with vintage wash, button front, and regular comfort fit.",
        price: 2499,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
        stock: 15
    },
    {
        name: "Minimalist Leather Watch",
        description: "Sleek analog watch with genuine leather strap, water-resistant casing, and minimalist dial.",
        price: 3299,
        category: "Fashion",
        image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
        stock: 8
    },
    {
        name: "Clean Code: A Handbook of Agile Software Craftsmanship",
        description: "The definitive guide by Robert C. Martin on writing cleaner, readable, and maintainable software.",
        price: 799,
        category: "Books",
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
        stock: 30
    },
    {
        name: "Atomic Habits",
        description: "An easy and proven way to build good habits and break bad ones by James Clear.",
        price: 599,
        category: "Books",
        image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
        stock: 45
    },
    {
        name: "Ceramic Minimalist Desk Lamp",
        description: "Modern LED warm-light desk lamp with ceramic base, touch switch, and adjustable dimming.",
        price: 1899,
        category: "Home",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
        stock: 12
    },
    {
        name: "Handcrafted Coffee Mug Set",
        description: "Set of 2 artisan ceramic stoneware coffee mugs with matte glaze and comfortable grip.",
        price: 899,
        category: "Home",
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80",
        stock: 20
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.dbUrl);
        console.log("Connected to MongoDB for seeding...");

        const count = await Product.countDocuments();
        if (count === 0) {
            await Product.insertMany(sampleProducts);
            console.log(`Successfully seeded ${sampleProducts.length} sample products!`);
        } else {
            console.log(`Database already has ${count} products. Skipping seeding.`);
        }

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

seedDB();
