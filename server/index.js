import express from 'express'
import dotenv from 'dotenv'
import customerRoutes from "./routes/customer.routes.js"
import productRoutes from "./routes/product.routes.js"
import cookieParser from 'cookie-parser'
import cors from 'cors'
import wishlistRoutes from "./routes/wishlist.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import { connectDatabase } from "./utils/mongo.js";
import orderRoutes from "./routes/order.routes.js";
dotenv.config();

const app = express()
const Port = 8083
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json())
app.use(cookieParser())
app.use("/customers", customerRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/orders", orderRoutes);

const startServer = async () => {
    try {
        await connectDatabase();
        app.listen(Port, () => {
            console.log(`Server Started at ${Port}`)
        })
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};

startServer();

export default app;

