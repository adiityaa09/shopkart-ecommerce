import express from "express";
import { protect } from "../middlewares/auth.middleware.js"; // use your existing middleware name
import {
  createPaymentOrder,
  verifyPayment,
  getMyOrders,
  getOrderById,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/create-payment-order", protect, createPaymentOrder);
router.post("/verify-payment", protect, verifyPayment);
router.get("/", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

export default router;