import express from "express";
import { addToCart, getCartProducts, removeAllFromCart, updateQuantity } from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * Lấy danh sách sản phẩm trong giỏ hàng
 * GET /api/cart
 * Yêu cầu: Phải đăng nhập
 */
router.get("/", protectRoute, getCartProducts);

/**
 * Thêm sản phẩm vào giỏ hàng
 * POST /api/cart
 * Body: { productId }
 * Yêu cầu: Phải đăng nhập
 */
router.post("/", protectRoute, addToCart);

/**
 * Xóa sản phẩm khỏi giỏ hàng
 * DELETE /api/cart
 * Body: { productId } (nếu không truyền productId → xóa hết giỏ hàng)
 * Yêu cầu: Phải đăng nhập
 */
router.delete("/", protectRoute, removeAllFromCart);

/**
 * Cập nhật số lượng sản phẩm trong giỏ hàng
 * PUT /api/cart/:id
 * Params: id (productId)
 * Body: { quantity }
 * Yêu cầu: Phải đăng nhập
 */
router.put("/:id", protectRoute, updateQuantity);

export default router;