import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
console.log("Starting server...");
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

import { connectDB } from "./lib/db.js";

// Load biến môi trường từ file .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Lấy đường dẫn thư mục gốc của project
const __dirname = path.resolve();

/**
 * Middleware
 */
// Parse JSON body (tăng giới hạn lên 10MB để hỗ trợ upload ảnh base64)
app.use(express.json({ limit: "10mb" }));

// Parse cookie từ request (dùng để lấy accessToken, refreshToken)
app.use(cookieParser());

/**
 * Routes
 */
app.use("/api/auth", authRoutes);           // Route xác thực
app.use("/api/products", productRoutes);    // Route sản phẩm
app.use("/api/cart", cartRoutes);           // Route giỏ hàng
app.use("/api/coupons", couponRoutes);      // Route coupon
app.use("/api/payments", paymentRoutes);    // Route thanh toán
app.use("/api/analytics", analyticsRoutes); // Route analytics (admin)

/**
 * Production Mode - Serve frontend React/Vite
 * Khi deploy production, frontend được build vào thư mục frontend/dist
 */
if (process.env.NODE_ENV === "production") {
	// Serve các file tĩnh (CSS, JS, images...) của frontend
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	// Bất kỳ route nào không phải API → trả về file index.html (SPA routing)
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

/**
 * Khởi động server
 */
app.listen(PORT, () => {
	console.log("Server is running on http://localhost:" + PORT);
	
	// Kết nối đến MongoDB sau khi server khởi động
	connectDB();
});