import express from "express";
import { login, logout, signup, refreshToken, getProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * Đăng ký tài khoản mới
 * POST /api/auth/signup
 */
router.post("/signup", signup);

/**
 * Đăng nhập
 * POST /api/auth/login
 */
router.post("/login", login);

/**
 * Đăng xuất
 * POST /api/auth/logout
 */
router.post("/logout", logout);

/**
 * Làm mới Access Token (sử dụng Refresh Token)
 * POST /api/auth/refresh-token
 */
router.post("/refresh-token", refreshToken);

/**
 * Lấy thông tin profile của user hiện tại
 * GET /api/auth/profile
 * Yêu cầu phải đăng nhập (protectRoute)
 */
router.get("/profile", protectRoute, getProfile);

export default router;