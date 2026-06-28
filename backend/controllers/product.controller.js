import { redis } from "../lib/redis.js";
import cloudinary from "../lib/cloudinary.js";
import Product from "../models/product.model.js";

/**
 * Lấy tất cả sản phẩm
 */
export const getAllProducts = async (req, res) => {
	try {
		const products = await Product.find({}); // Lấy tất cả sản phẩm
		res.json({ products });
	} catch (error) {
		console.log("Error in getAllProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

/**
 * Lấy danh sách sản phẩm nổi bật (Featured Products)
 * Sử dụng Redis cache để tăng tốc độ
 */
export const getFeaturedProducts = async (req, res) => {
	try {
		// Kiểm tra cache trong Redis trước
		let featuredProducts = await redis.get("featured_products");

		if (featuredProducts) {
			return res.json(JSON.parse(featuredProducts));
		}

		// Nếu chưa có trong Redis → lấy từ MongoDB
		// .lean() trả về plain JavaScript object (nhanh hơn, không có method Mongoose)
		featuredProducts = await Product.find({ isFeatured: true }).lean();

		if (!featuredProducts || featuredProducts.length === 0) {
			return res.status(404).json({ message: "No featured products found" });
		}

		// Lưu vào Redis để lần sau lấy nhanh
		await redis.set("featured_products", JSON.stringify(featuredProducts));

		res.json(featuredProducts);
	} catch (error) {
		console.log("Error in getFeaturedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

/**
 * Tạo sản phẩm mới
 * - Upload ảnh lên Cloudinary (nếu có)
 * - Lưu thông tin sản phẩm vào MongoDB
 */
export const createProduct = async (req, res) => {
	try {
		const { name, description, price, image, category } = req.body;

		let cloudinaryResponse = null;

		// Upload ảnh nếu có
		if (image) {
			cloudinaryResponse = await cloudinary.uploader.upload(image, { 
				folder: "products" 
			});
		}

		const product = await Product.create({
			name,
			description,
			price,
			image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
			category,
		});

		res.status(201).json(product);
	} catch (error) {
		console.log("Error in createProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

/**
 * Xóa sản phẩm
 * - Xóa ảnh trên Cloudinary (nếu có)
 * - Xóa record trong MongoDB
 */
export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ message: "Product not found" });
		}

		// Xóa ảnh trên Cloudinary
		if (product.image) {
			const publicId = product.image.split("/").pop().split(".")[0];
			try {
				await cloudinary.uploader.destroy(`products/${publicId}`);
				console.log("Deleted image from Cloudinary");
			} catch (error) {
				console.log("Error deleting image from Cloudinary", error);
			}
		}

		await Product.findByIdAndDelete(req.params.id);

		res.json({ message: "Product deleted successfully" });
	} catch (error) {
		console.log("Error in deleteProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

/**
 * Lấy sản phẩm gợi ý (Recommended Products)
 * Dùng $sample để lấy ngẫu nhiên 4 sản phẩm
 */
export const getRecommendedProducts = async (req, res) => {
	try {
		const products = await Product.aggregate([
			{
				$sample: { size: 4 }, // Lấy ngẫu nhiên 4 sản phẩm
			},
			{
				$project: {
					_id: 1,
					name: 1,
					description: 1,
					image: 1,
					price: 1,
				},
			},
		]);

		res.json(products);
	} catch (error) {
		console.log("Error in getRecommendedProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

/**
 * Lấy sản phẩm theo danh mục
 */
export const getProductsByCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const products = await Product.find({ category });
		res.json({ products });
	} catch (error) {
		console.log("Error in getProductsByCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

/**
 * Bật/Tắt trạng thái nổi bật (Featured) cho một sản phẩm
 * Sau khi thay đổi sẽ cập nhật lại cache Redis
 */
export const toggleFeaturedProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (product) {
			product.isFeatured = !product.isFeatured; // Đảo trạng thái
			const updatedProduct = await product.save();

			// Cập nhật cache featured products
			await updateFeaturedProductsCache();

			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		console.log("Error in toggleFeaturedProduct controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

/**
 * Hàm hỗ trợ: Cập nhật cache featured products trong Redis
 */
async function updateFeaturedProductsCache() {
	try {
		const featuredProducts = await Product.find({ isFeatured: true }).lean();
		await redis.set("featured_products", JSON.stringify(featuredProducts));
	} catch (error) {
		console.log("Error in updateFeaturedProductsCache function", error);
	}
}