import mongoose from "mongoose";

/**
 * Định nghĩa Schema cho Product (Sản phẩm)
 */
const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,           // Bắt buộc phải có tên sản phẩm
		},
		description: {
			type: String,
			required: true,           // Mô tả sản phẩm
		},
		price: {
			type: Number,
			min: 0,                   // Giá không được âm
			required: true,
		},
		image: {
			type: String,
			required: [true, "Image is required"],  // Bắt buộc phải có ảnh
		},
		category: {
			type: String,
			required: true,           // Phân loại sản phẩm (ví dụ: "shirt", "jeans",...)
		},
		isFeatured: {
			type: Boolean,
			default: false,           // Sản phẩm nổi bật (dùng cho trang chủ)
		},
	},
	{ 
		timestamps: true              // Tự động tạo createdAt và updatedAt
	}
);

/**
 * Tạo model Product từ schema
 */
const Product = mongoose.model("Product", productSchema);

export default Product;