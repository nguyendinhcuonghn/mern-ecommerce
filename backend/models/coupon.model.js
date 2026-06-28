import mongoose from "mongoose";

/**
 * Định nghĩa Schema cho Coupon (Mã giảm giá)
 */
const couponSchema = new mongoose.Schema(
	{
		code: {
			type: String,
			required: true,      // Bắt buộc phải có
			unique: true,        // Mỗi mã giảm giá là duy nhất
		},
		discountPercentage: {
			type: Number,
			required: true,
			min: 0,              // Giá trị nhỏ nhất = 0%
			max: 100,            // Giá trị lớn nhất = 100%
		},
		expirationDate: {
			type: Date,
			required: true,      // Phải có ngày hết hạn
		},
		isActive: {
			type: Boolean,
			default: true,       // Mặc định coupon còn hoạt động
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",         // Liên kết với model User
			required: true,
			unique: true,        // Mỗi user chỉ có tối đa 1 coupon active
		},
	},
	{
		timestamps: true,        // Tự động thêm createdAt và updatedAt
	}
);

/**
 * Tạo model Coupon từ schema
 */
const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;