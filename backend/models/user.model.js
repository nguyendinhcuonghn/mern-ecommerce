import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * Định nghĩa Schema cho User (Người dùng)
 */
const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,           // Không cho phép email trùng lặp
			lowercase: true,        // Tự động chuyển về chữ thường
			trim: true,             // Xóa khoảng trắng thừa
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [6, "Password must be at least 6 characters long"],
		},
		cartItems: [
			{
				quantity: {
					type: Number,
					default: 1,     // Mặc định số lượng là 1
				},
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product", // Liên kết với model Product
				},
			},
		],
		role: {
			type: String,
			enum: ["customer", "admin"],  // Chỉ cho phép 2 quyền
			default: "customer",          // Mặc định là khách hàng
		},
	},
	{
		timestamps: true,                 // Tự động thêm createdAt, updatedAt
	}
);

/**
 * Pre-save hook: Mã hóa password trước khi lưu vào database
 * Chỉ hash password khi nó bị thay đổi (kể cả khi tạo user mới)
 */
userSchema.pre("save", async function (next) {
	// Nếu password không thay đổi thì bỏ qua
	if (!this.isModified("password")) return next();

	try {
		const salt = await bcrypt.genSalt(10);           // Tạo salt
		this.password = await bcrypt.hash(this.password, salt); // Hash password
		next();
	} catch (error) {
		next(error);
	}
});

/**
 * Method so sánh password khi user đăng nhập
 * Dùng bcrypt.compare để so sánh password nhập vào với hash trong DB
 */
userSchema.methods.comparePassword = async function (password) {
	return bcrypt.compare(password, this.password);
};

/**
 * Tạo model User từ schema
 */
const User = mongoose.model("User", userSchema);

export default User;