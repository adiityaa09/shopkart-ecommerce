import crypto from "crypto";
import mongoose from "mongoose";
import razorpay from "../config/razorpay.js";
import Order from "../models/order.model.js";
import Customer from "../models/customer.model.js";

const getUserId = (req) => req.user._id || req.user.id;

const validateShipping = (a) => {
  if (!a) return "Shipping address is required.";
  const fields = ["fullName", "phone", "addressLine1", "city", "state", "pincode"];
  for (const f of fields) {
    if (!a[f] || typeof a[f] !== "string" || !a[f].trim()) {
      return `${f} is required.`;
    }
  }
  if (!/^[6-9]\d{9}$/.test(a.phone.trim())) return "Enter a valid 10-digit phone number.";
  if (!/^\d{6}$/.test(a.pincode.trim())) return "Pincode must contain 6 digits.";
  return null;
};

// POST /orders/create-payment-order
export const createPaymentOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body; // totalAmount / items from frontend are ignored

    const shipErr = validateShipping(shippingAddress);
    if (shipErr) return res.status(400).json({ success: false, message: shipErr });

    const user = await Customer.findById(getUserId(req)).populate("cart.product");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty." });
    }

    const items = [];
    let totalAmount = 0;

    for (const cartItem of user.cart) {
      const product = cartItem.product; // latest product data (null if deleted)
      if (!product) {
        return res.status(400).json({
          success: false,
          message: "A product in your cart is no longer available.",
        });
      }
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}.`,
        });
      }

      items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: cartItem.quantity,
        image: product.image,
      });
      totalAmount += product.price * cartItem.quantity;
    }

    const shippingClean = {
      fullName: shippingAddress.fullName.trim(),
      phone: shippingAddress.phone.trim(),
      addressLine1: shippingAddress.addressLine1.trim(),
      city: shippingAddress.city.trim(),
      state: shippingAddress.state.trim(),
      pincode: shippingAddress.pincode.trim(),
    };

    const order = await Order.create({
      user: user._id,
      items,
      shippingAddress: shippingClean,
      totalAmount,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // rupees -> paise
      currency: "INR",
      receipt: order._id.toString(),
    });

    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    res.status(201).json({
      success: true,
      shopKartOrderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Could not create payment order." });
  }
};

// POST /orders/verify-payment
export const verifyPayment = async (req, res) => {
  try {
    const { shopKartOrderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!mongoose.isValidObjectId(shopKartOrderId) || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment details." });
    }

    const order = await Order.findById(shopKartOrderId);
    if (!order || order.user.toString() !== getUserId(req).toString()) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    if (order.paymentStatus === "PAID") {
      return res.json({ success: true, order }); // already verified
    }

    if (razorpay_order_id !== order.razorpayOrderId) {
      return res.status(400).json({ success: false, message: "Order mismatch." });
    }

    // Use the order id stored in DB, not the browser's
    const body = order.razorpayOrderId + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid payment signature" });
    }

    order.paymentStatus = "PAID";
    order.status = "PLACED";
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    // Clear the cart only now
    await Customer.findByIdAndUpdate(order.user, { cart: [] });

    res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Payment verification failed." });
  }
};

// GET /orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: getUserId(req), paymentStatus: "PAID" }).sort({
      createdAt: -1,
    });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Could not fetch orders." });
  }
};

// GET /orders/:id
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }
    const order = await Order.findById(id);
    if (!order || order.user.toString() !== getUserId(req).toString()) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Could not fetch order." });
  }
};