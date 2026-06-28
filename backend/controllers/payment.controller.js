import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { stripe } from "../lib/stripe.js";

/**
 * Tạo Stripe Checkout Session cho thanh toán
 * - Xử lý danh sách sản phẩm
 * - Áp dụng coupon nếu có
 * - Tạo session thanh toán trên Stripe
 */
export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode } = req.body;

		// Kiểm tra dữ liệu đầu vào
		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = 0;

		// Chuyển danh sách sản phẩm sang định dạng line_items của Stripe
		const lineItems = products.map((product) => {
			const amount = Math.round(product.price * 100); // Stripe yêu cầu đơn vị cents
			totalAmount += amount * product.quantity;

			return {
				price_data: {
					currency: "usd",
					product_data: {
						name: product.name,
						images: [product.image],
					},
					unit_amount: amount,
				},
				quantity: product.quantity || 1,
			};
		});

		let coupon = null;
		// Kiểm tra và áp dụng coupon nếu người dùng truyền couponCode
		if (couponCode) {
			coupon = await Coupon.findOne({ 
				code: couponCode, 
				userId: req.user._id, 
				isActive: true 
			});
			
			if (coupon) {
				// Tính giảm giá
				totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
			}
		}

		// Tạo Checkout Session trên Stripe
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",                    // Thanh toán một lần
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
			
			// Áp dụng discount qua Stripe Coupon
			discounts: coupon
				? [{ coupon: await createStripeCoupon(coupon.discountPercentage) }]
				: [],
			
			// Lưu thông tin bổ sung để dùng sau khi thanh toán thành công
			metadata: {
				userId: req.user._id.toString(),
				couponCode: couponCode || "",
				products: JSON.stringify(
					products.map((p) => ({
						id: p._id,
						quantity: p.quantity,
						price: p.price,
					}))
				),
			},
		});

		// Nếu tổng tiền >= 200 USD → tặng coupon mới cho user
		if (totalAmount >= 20000) { // 200 USD (tính theo cents)
			await createNewCoupon(req.user._id);
		}

		res.status(200).json({ 
			id: session.id, 
			totalAmount: totalAmount / 100 // Trả về USD cho frontend 
		});
	} catch (error) {
		console.error("Error processing checkout:", error);
		res.status(500).json({ message: "Error processing checkout", error: error.message });
	}
};

/**
 * Xử lý sau khi thanh toán thành công (Webhook hoặc gọi từ frontend)
 * - Kiểm tra session thanh toán
 * - Hủy coupon nếu đã sử dụng
 * - Tạo Order trong database
 */
export const checkoutSuccess = async (req, res) => {
	try {
		const { sessionId } = req.body;
		
		// Lấy thông tin session từ Stripe
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status === "paid") {
			// Nếu dùng coupon → tắt active
			if (session.metadata.couponCode) {
				await Coupon.findOneAndUpdate(
					{
						code: session.metadata.couponCode,
						userId: session.metadata.userId,
					},
					{ isActive: false }
				);
			}

			// Tạo đơn hàng mới
			const products = JSON.parse(session.metadata.products);
			const newOrder = new Order({
				user: session.metadata.userId,
				products: products.map((product) => ({
					product: product.id,
					quantity: product.quantity,
					price: product.price,
				})),
				totalAmount: session.amount_total / 100, // Convert từ cents sang USD
				stripeSessionId: sessionId,
			});

			await newOrder.save();

			res.status(200).json({
				success: true,
				message: "Payment successful, order created, and coupon deactivated if used.",
				orderId: newOrder._id,
			});
		}
	} catch (error) {
		console.error("Error processing successful checkout:", error);
		res.status(500).json({ message: "Error processing successful checkout", error: error.message });
	}
};

/**
 * Tạo Stripe Coupon (dùng để áp dụng giảm giá trong Checkout Session)
 */
async function createStripeCoupon(discountPercentage) {
	const coupon = await stripe.coupons.create({
		percent_off: discountPercentage,
		duration: "once",           // Chỉ áp dụng cho lần thanh toán này
	});

	return coupon.id;
}

/**
 * Tạo coupon mới tặng cho user khi mua hàng đủ điều kiện (>= 200 USD)
 */
async function createNewCoupon(userId) {
	// Xóa coupon cũ của user (nếu có)
	await Coupon.findOneAndDelete({ userId });

	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,                    // Giảm 10%
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Hạn 30 ngày
		userId: userId,
	});

	await newCoupon.save();
	return newCoupon;
}