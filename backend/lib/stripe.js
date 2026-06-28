import Stripe from "stripe";
import dotenv from "dotenv";

// Load biến môi trường từ file .env
dotenv.config();

/**
 * Khởi tạo Stripe instance
 * 
 * Stripe là cổng thanh toán trực tuyến phổ biến nhất thế giới.
 * Chúng ta sử dụng Secret Key để server có thể:
 * - Tạo Checkout Session
 * - Xử lý webhook
 * - Retrieve session, payment intent...
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Lưu ý quan trọng:
 * 
 * - Chỉ dùng STRIPE_SECRET_KEY ở phía server (không bao giờ public).
 * - Trong file .env nên có dòng:
 *   STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxx hoặc sk_test_xxxxxxxxxxxxxxx
 * 
 * Cách sử dụng trong controller:
 * - stripe.checkout.sessions.create(...)
 * - stripe.checkout.sessions.retrieve(sessionId)
 * - stripe.webhooks.constructEvent(...)
 */