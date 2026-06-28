import toast from "react-hot-toast";
import { ShoppingCart } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

/**
 * Component ProductCard - Thẻ hiển thị sản phẩm
 * Dùng ở nhiều nơi: trang chủ, trang danh mục, gợi ý sản phẩm...
 */
const ProductCard = ({ product }) => {
	// Lấy thông tin user từ store
	const { user } = useUserStore();
	
	// Lấy hàm thêm vào giỏ hàng từ Cart Store
	const { addToCart } = useCartStore();

	/**
	 * Xử lý thêm sản phẩm vào giỏ hàng
	 */
	const handleAddToCart = () => {
		// Nếu chưa đăng nhập → yêu cầu login
		if (!user) {
			toast.error("Please login to add products to cart", { 
				id: "login"   // id để tránh toast hiển thị nhiều lần
			});
			return;
		} 
		
		// Đã login → thêm vào giỏ
		addToCart(product);
	};

	return (
		<div className='flex w-full relative flex-col overflow-hidden rounded-lg border border-gray-700 shadow-lg'>
			
			{/* Phần hình ảnh */}
			<div className='relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl'>
				<img 
					className='object-cover w-full' 
					src={product.image} 
					alt='product image' 
				/>
				{/* Overlay tối để tăng tính thẩm mỹ */}
				<div className='absolute inset-0 bg-black bg-opacity-20' />
			</div>

			{/* Phần thông tin sản phẩm */}
			<div className='mt-4 px-5 pb-5'>
				{/* Tên sản phẩm */}
				<h5 className='text-xl font-semibold tracking-tight text-white'>
					{product.name}
				</h5>

				{/* Giá sản phẩm */}
				<div className='mt-2 mb-5 flex items-center justify-between'>
					<p>
						<span className='text-3xl font-bold text-emerald-400'>
							${product.price}
						</span>
					</p>
				</div>

				{/* Nút thêm vào giỏ hàng */}
				<button
					className='flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-center text-sm font-medium
					 text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
					onClick={handleAddToCart}
				>
					<ShoppingCart size={22} className='mr-2' />
					Add to cart
				</button>
			</div>
		</div>
	);
};

export default ProductCard;