import axios from "axios";

/**
 * Tạo một instance axios tùy chỉnh (axiosInstance)
 * Giúp cấu hình chung cho tất cả các request trong project
 */
const axiosInstance = axios.create({
	// Base URL khác nhau giữa Development và Production
	baseURL: import.meta.mode === "development" 
		? "http://localhost:5000/api"     // Dev: gọi thẳng backend
		: "/api",                         // Production: dùng relative path (proxy)

	// Cho phép gửi cookie (accessToken, refreshToken) kèm theo request
	withCredentials: true, // send cookies to the server
});

export default axiosInstance;