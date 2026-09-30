import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import customerRoutes from "./routes/customer.routes.js"
import productRoutes from "./routes/product.routes.js"
import cookieParser from 'cookie-parser'
import cors from 'cors'
import wishlistRoutes from "./routes/wishlist.routes.js";

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
app.use("/wishlist", wishlistRoutes);
mongoose.connect(process.env.dbUrl)
    .then(() => {
        console.log("Db Connected")
    })
    .catch((err) => {
        console.log(err)
    })

app.listen(Port, () => {
    console.log(`Server Started at ${Port}`)
})

export default app;

