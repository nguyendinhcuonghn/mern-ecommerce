import Redis from "ioredis";
import dotenv from "dotenv";

// Load biến môi trường từ file .env
dotenv.config();

/**
 * Khởi tạo kết nối Redis sử dụng Upstash (Redis serverless)
 * 
 * ioredis là một thư viện Redis client mạnh mẽ, hỗ trợ:
 * - Promise-based (async/await)
 * - Clustering, Sentinel, Pipeline, Lua script...
 * - Tự động reconnect khi mất kết nối
 */
export const redis = new Redis(process.env.UPSTASH_REDIS_URL);

/**
 * Một số method thường dùng với redis instance này:
 * 
 * redis.set(key, value, "EX", seconds)     → Lưu với thời gian hết hạn
 * redis.get(key)                           → Lấy giá trị
 * redis.del(key)                           → Xóa key
 * redis.exists(key)                        → Kiểm tra key tồn tại
 * redis.ttl(key)                           → Xem thời gian còn lại (Time To Live)
 */

// Optional: Lắng nghe sự kiện kết nối (để debug)
redis.on("connect", () => {
    console.log("✅ Connected to Redis (Upstash)");
});

redis.on("error", (err) => {
    console.error("❌ Redis connection error:", err);
});