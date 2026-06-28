import { Minus, Plus, Trash } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

/**
 * Component CartItem - Hiển thị một sản phẩm trong giỏ hàng
 * 
 * Nhận props:
 * - item: object chứa thông tin sản phẩm trong giỏ hàng
 *   (thường có: _id, name, description, price, image, quantity)
 */
const CartItem = ({ item }) => {
	// Lấy 2 hàm từ Cart Store (Zustand):
	// - removeFromCart: xóa sản phẩm khỏi giỏ
	// - updateQuantity: cập nhật số lượng sản phẩm
	const { removeFromCart, updateQuantity } = useCartStore();

	return (
		<div className='rounded-lg border p-4 shadow-sm border-gray-700 bg-gray-800 md:p-6'>
			{/* 
				Layout chính:
				- Trên mobile: hiển thị theo chiều dọc
				- Trên md trở lên: hiển thị theo chiều ngang (flex)
			*/}
			<div className='space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0'>
				
				{/* === PHẦN ẢNH SẢN PHẨM === */}
				<div className='shrink-0 md:order-1'>
					<img 
						className='h-20 md:h-32 rounded object-cover' 
						src={item.image} 
						alt={item.name} 
					/>
				</div>

				{/* Label ẩn cho accessibility (screen reader) */}
				<label className='sr-only'>Choose quantity:</label>

				{/* === PHẦN SỐ LƯỢNG + GIÁ === */}
				<div className='flex items-center justify-between md:order-3 md:justify-end'>
					{/* Nút tăng/giảm số lượng */}
					<div className='flex items-center gap-2'>
						{/* Nút giảm số lượng */}
						<button
							className='inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border
							 border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2
							  focus:ring-emerald-500'
							onClick={() => updateQuantity(item._id, item.quantity - 1)}
						>
							<Minus className='text-gray-300' />
						</button>

						{/* Hiển thị số lượng hiện tại */}
						<p>{item.quantity}</p>

						{/* Nút tăng số lượng */}
						<button
							className='inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border
							 border-gray-600 bg-gray-700 hover:bg-gray-600 focus:outline-none 
						focus:ring-2 focus:ring-emerald-500'
							onClick={() => updateQuantity(item._id, item.quantity + 1)}
						>
							<Plus className='text-gray-300' />
						</button>
					</div>

					{/* Giá sản phẩm (bên phải) */}
					<div className='text-end md:order-4 md:w-32'>
						<p className='text-base font-bold text-emerald-400'>${item.price}</p>
					</div>
				</div>

				{/* === PHẦN THÔNG TIN SẢN PHẨM (Tên + Mô tả + Nút xóa) === */}
				<div className='w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md'>
					{/* Tên sản phẩm */}
					<p className='text-base font-medium text-white hover:text-emerald-400 hover:underline'>
						{item.name}
					</p>

					{/* Mô tả sản phẩm */}
					<p className='text-sm text-gray-400'>{item.description}</p>

					{/* Nút xóa sản phẩm khỏi giỏ hàng */}
					<div className='flex items-center gap-4'>
						<button
							className='inline-flex items-center text-sm font-medium text-red-400
							 hover:text-red-300 hover:underline'
							onClick={() => removeFromCart(item._id)}
						>
							<Trash className="w-4 h-4 mr-1" />
							Xóa
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CartItem;