import express from "express";
import authMiddleware from "../middlewares/auth.middlware.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getWishlist);
router.post("/:productId", authMiddleware, addToWishlist);
router.delete("/:productId", authMiddleware, removeFromWishlist);

export default router;