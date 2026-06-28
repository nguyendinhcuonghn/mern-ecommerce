import Product from "../models/product.model.js";

/**
 * Lấy danh sách sản phẩm trong giỏ hàng của user
 * - Lấy thông tin chi tiết sản phẩm từ collection Product
 * - Kết hợp với quantity từ cartItems của user
 */
export const getCartProducts = async (req, res) => {
	try {
		// Tìm tất cả sản phẩm có ID nằm trong cartItems của user
		const products = await Product.find({ 
			_id: { $in: req.user.cartItems } 
		});

		// Thêm thông tin quantity cho từng sản phẩm
		const cartItems = products.map((product) => {
			// Tìm quantity tương ứng trong cartItems của user
			const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
			
			// Trả về object sản phẩm + quantity
			return { 
				...product.toJSON(), 
				quantity: item.quantity 
			};
		});

		res.json(cartItems);
	} catch (error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

/**
 * Thêm sản phẩm vào giỏ hàng
 * - Nếu sản phẩm đã có trong giỏ → tăng quantity lên 1
 * - Nếu chưa có → thêm mới vào cartItems
 */
export const addToCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;

		// Kiểm tra sản phẩm đã tồn tại trong giỏ hàng chưa
		const existingItem = user.cartItems.find((item) => item.id === productId);

		if (existingItem) {
			// Đã có → tăng số lượng
			existingItem.quantity += 1;
		} else {
			// Chưa có → thêm mới (mặc định quantity = 1)
			user.cartItems.push(productId);
		}

		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		console.log("Error in addToCart controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

/**
 * Xóa sản phẩm khỏi giỏ hàng
 * - Nếu không truyền productId → xóa toàn bộ giỏ hàng
 * - Nếu có productId → chỉ xóa sản phẩm đó
 */
export const removeAllFromCart = async (req, res) => {
	try {
		const { productId } = req.body;
		const user = req.user;

		if (!productId) {
			// Xóa hết giỏ hàng
			user.cartItems = [];
		} else {
			// Xóa chỉ một sản phẩm
			user.cartItems = user.cartItems.filter((item) => item.id !== productId);
		}

		await user.save();
		res.json(user.cartItems);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

/**
 * Cập nhật số lượng sản phẩm trong giỏ hàng
 * - Nếu quantity = 0 → xóa sản phẩm khỏi giỏ
 * - Nếu quantity > 0 → cập nhật số lượng mới
 */
export const updateQuantity = async (req, res) => {
	try {
		const { id: productId } = req.params;
		const { quantity } = req.body;
		const user = req.user;

		// Tìm sản phẩm trong giỏ hàng
		const existingItem = user.cartItems.find((item) => item.id === productId);

		if (existingItem) {
			if (quantity === 0) {
				// Quantity = 0 → xóa sản phẩm
				user.cartItems = user.cartItems.filter((item) => item.id !== productId);
				await user.save();
				return res.json(user.cartItems);
			}

			// Cập nhật quantity mới
			existingItem.quantity = quantity;
			await user.save();
			res.json(user.cartItems);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in updateQuantity controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};