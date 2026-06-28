import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// Load các biến môi trường từ file .env
dotenv.config();

/**
 * Cấu hình Cloudinary - Dịch vụ lưu trữ hình ảnh mạnh mẽ
 * 
 * Cloudinary là dịch vụ cloud-based cho phép:
 * - Upload ảnh/video
 * - Tối ưu hình ảnh (resize, crop, format...)
 * - Lưu trữ và quản lý media
 * - Tạo URL động với transformation
 */
cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,   // Tên cloud của bạn
	api_key: process.env.CLOUDINARY_API_KEY,         // API Key
	api_secret: process.env.CLOUDINARY_API_SECRET,   // API Secret (bí mật - không public)
});

/**
 * Export default để sử dụng ở các file khác (ví dụ: product.controller.js)
 * 
 * Cách sử dụng phổ biến:
 * - cloudinary.uploader.upload(image, options)
 * - cloudinary.uploader.destroy(publicId)
 */
export default cloudinary;