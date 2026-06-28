import Coupon from "../models/coupon.model.js";

/**
 * Lấy coupon đang active của user hiện tại
 * Mỗi user chỉ có tối đa 1 coupon active tại một thời điểm
 */
export const getCoupon = async (req, res) => {
	try {
		// Tìm coupon thuộc về user và đang active
		const coupon = await Coupon.findOne({ 
			userId: req.user._id, 
			isActive: true 
		});

		// Trả về coupon hoặc null nếu không tìm thấy
		res.json(coupon || null);
	} catch (error) {
		console.log("Error in getCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

/**
 * Kiểm tra tính hợp lệ của coupon
 * - Kiểm tra coupon tồn tại, thuộc về user và đang active
 * - Kiểm tra hạn sử dụng (expirationDate)
 */
export const validateCoupon = async (req, res) => {
	try {
		const { code } = req.body;

		// Tìm coupon theo code, userId và trạng thái active
		const coupon = await Coupon.findOne({ 
			code: code, 
			userId: req.user._id, 
			isActive: true 
		});

		// Không tìm thấy coupon
		if (!coupon) {
			return res.status(404).json({ message: "Coupon not found" });
		}

		// Kiểm tra coupon đã hết hạn chưa
		if (coupon.expirationDate < new Date()) {
			// Hết hạn → tắt active và thông báo
			coupon.isActive = false;
			await coupon.save();
			return res.status(404).json({ message: "Coupon expired" });
		}

		// Coupon hợp lệ → trả về thông tin
		res.json({
			message: "Coupon is valid",
			code: coupon.code,
			discountPercentage: coupon.discountPercentage,
		});
	} catch (error) {
		console.log("Error in validateCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};