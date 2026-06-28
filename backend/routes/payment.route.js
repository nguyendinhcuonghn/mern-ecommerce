import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkoutSuccess, createCheckoutSession } from "../controllers/payment.controller.js";

const router = express.Router();

/**
 * Tạo Stripe Checkout Session
 * POST /api/payment/create-checkout-session
 * Body: { products, couponCode? }
 * Yêu cầu: Phải đăng nhập
 */
router.post("/create-checkout-session", protectRoute, createCheckoutSession);

/**
 * Xử lý sau khi thanh toán thành công
 * POST /api/payment/checkout-success
 * Body: { sessionId }
 * Yêu cầu: Phải đăng nhập
 * 
 * Thường được gọi từ frontend sau khi redirect từ Stripe về success page
 */
router.post("/checkout-success", protectRoute, checkoutSuccess);

export default router;