import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * Middleware bảo vệ route (Authentication)
 * Kiểm tra user đã đăng nhập chưa qua Access Token trong cookie
 */
export const protectRoute = async (req, res, next) => {
	try {
		const accessToken = req.cookies.accessToken;

		// Nếu không có access token → chưa đăng nhập
		if (!accessToken) {
			return res.status(401).json({ message: "Unauthorized - No access token provided" });
		}

		try {
			// Giải mã token
			const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

			// Tìm user trong database (không lấy password)
			const user = await User.findById(decoded.userId).select("-password");

			if (!user) {
				return res.status(401).json({ message: "User not found" });
			}

			// Gán thông tin user vào request để các controller sau sử dụng
			req.user = user;

			// Cho phép đi tiếp đến controller
			next();
		} catch (error) {
			// Xử lý riêng trường hợp token hết hạn
			if (error.name === "TokenExpiredError") {
				return res.status(401).json({ message: "Unauthorized - Access token expired" });
			}
			throw error;
		}
	} catch (error) {
		console.log("Error in protectRoute middleware", error.message);
		return res.status(401).json({ message: "Unauthorized - Invalid access token" });
	}
};

/**
 * Middleware kiểm tra quyền Admin
 * Phải đặt SAU protectRoute vì cần có req.user
 */
export const adminRoute = (req, res, next) => {
	// Kiểm tra user đã được gán bởi protectRoute và có role là admin
	if (req.user && req.user.role === "admin") {
		next(); // Cho phép đi tiếp
	} else {
		return res.status(403).json({ message: "Access denied - Admin only" });
	}
};