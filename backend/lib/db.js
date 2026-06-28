import mongoose from "mongoose";

/**
 * Kết nối đến MongoDB
 * 
 * Hàm này được gọi khi khởi động server (thường trong file server.js hoặc index.js)
 * Sử dụng Mongoose - một ODM (Object Data Modeling) phổ biến cho MongoDB
 */
export const connectDB = async () => {
	try {
		// Kết nối đến MongoDB bằng MONGO_URI từ file .env
		const conn = await mongoose.connect(process.env.MONGO_URI);

		// In ra thông báo kết nối thành công kèm host
		console.log(`MongoDB connected: ${conn.connection.host}`);
	} catch (error) {
		console.log("Error connecting to MONGODB", error.message);
		
		// Thoát process nếu kết nối thất bại (để tránh server chạy khi DB lỗi)
		process.exit(1);
	}
};