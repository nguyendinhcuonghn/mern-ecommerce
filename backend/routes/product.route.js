import express from "express";
import {
	createProduct,
	deleteProduct,
	getAllProducts,
	getFeaturedProducts,
	getProductsByCategory,
	getRecommendedProducts,
	toggleFeaturedProduct,
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * Lấy tất cả sản phẩm
 * GET /api/products
 * Yêu cầu: Phải đăng nhập + quyền Admin
 */
router.get("/", protectRoute, adminRoute, getAllProducts);

/**
 * Lấy sản phẩm nổi bật (Featured Products)
 * GET /api/products/featured
 * Không yêu cầu đăng nhập (public)
 */
router.get("/featured", getFeaturedProducts);

/**
 * Lấy sản phẩm theo danh mục
 * GET /api/products/category/:category
 * Không yêu cầu đăng nhập (public)
 */
router.get("/category/:category", getProductsByCategory);

/**
 * Lấy sản phẩm gợi ý (random)
 * GET /api/products/recommendations
 * Không yêu cầu đăng nhập (public)
 */
router.get("/recommendations", getRecommendedProducts);

/**
 * Tạo sản phẩm mới
 * POST /api/products
 * Yêu cầu: Phải đăng nhập + quyền Admin
 */
router.post("/", protectRoute, adminRoute, createProduct);

/**
 * Bật/Tắt sản phẩm nổi bật
 * PATCH /api/products/:id
 * Yêu cầu: Phải đăng nhập + quyền Admin
 */
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);

/**
 * Xóa sản phẩm
 * DELETE /api/products/:id
 * Yêu cầu: Phải đăng nhập + quyền Admin
 */
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;