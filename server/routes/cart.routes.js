import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { addToCart, getCart, updateQuantity, removeFromCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getCart);
router.post("/:productId", authMiddleware, addToCart);
router.patch("/:productId", authMiddleware, updateQuantity);
router.delete("/:productId", authMiddleware, removeFromCart);

export default router;