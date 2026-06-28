import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { getAnalyticsData, getDailySalesData } from "../controllers/analytics.controller.js";

const router = express.Router();

/**
 * Route lấy dữ liệu Analytics cho Admin Dashboard
 * 
 * Endpoint: GET /api/analytics/
 * 
 * Yêu cầu:
 * - User phải đã đăng nhập (protectRoute)
 * - User phải có quyền Admin (adminRoute)
 */
router.get("/", protectRoute, adminRoute, async (req, res) => {
	try {
		// Lấy dữ liệu tổng quan (tổng user, sản phẩm, đơn hàng, doanh thu)
		const analyticsData = await getAnalyticsData();

		// Thiết lập khoảng thời gian mặc định: 7 ngày gần nhất
		const endDate = new Date();
		const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // trừ 7 ngày

		// Lấy dữ liệu doanh số theo ngày để vẽ biểu đồ
		const dailySalesData = await getDailySalesData(startDate, endDate);

		// Trả về cả 2 loại dữ liệu
		res.json({
			analyticsData,
			dailySalesData,
		});
	} catch (error) {
		console.log("Error in analytics route", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

export default router;