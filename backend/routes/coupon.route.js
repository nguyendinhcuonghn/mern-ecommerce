import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";

const router = express.Router();

/**
 * Lấy coupon đang active của user hiện tại
 * GET /api/coupon
 * Yêu cầu: Phải đăng nhập
 */
router.get("/", protectRoute, getCoupon);

/**
 * Kiểm tra tính hợp lệ của coupon
 * POST /api/coupon/validate
 * Body: { code }
 * Yêu cầu: Phải đăng nhập
 */
router.post("/validate", protectRoute, validateCoupon);

export default router;