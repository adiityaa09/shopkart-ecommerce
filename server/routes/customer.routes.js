import express from "express";
import {
    registerCustomer,
    loginCustomer,
    getMyProfile
} from "../controllers/customer.controller.js";

import authMiddleware from "../middlewares/auth.middlware.js";

const router = express.Router();

router.post("/register", registerCustomer);

router.post("/login", loginCustomer);

router.get("/me", authMiddleware, getMyProfile);

export default router;