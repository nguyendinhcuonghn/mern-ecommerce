import mongoose from "mongoose";

/**
 * Định nghĩa Schema cho Order (Đơn hàng)
 */
const orderSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",           // Liên kết với model User
			required: true,
		},
		products: [
			{
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",    // Liên kết với model Product
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
					min: 1,            // Ít nhất phải mua 1 sản phẩm
				},
				price: {
					type: Number,
					required: true,
					min: 0,
				},
			},
		],
		totalAmount: {
			type: Number,
			required: true,
			min: 0,
		},
		stripeSessionId: {
			type: String,
			unique: true,          // Mỗi session Stripe chỉ tạo 1 đơn hàng
		},
	},
	{ 
		timestamps: true           // Tự động thêm createdAt và updatedAt
	}
);

/**
 * Tạo model Order từ schema
 */
const Order = mongoose.model("Order", orderSchema);

export default Order;