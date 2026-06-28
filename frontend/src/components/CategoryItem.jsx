import { Link } from "react-router-dom";

/**
 * Component CategoryItem - Hiển thị một danh mục sản phẩm dưới dạng card
 * 
 * Props:
 * - category: object chứa thông tin danh mục
 *   Ví dụ: { name, imageUrl, href }
 */
const CategoryItem = ({ category }) => {
	return (
		<div className='relative overflow-hidden h-96 w-full rounded-lg group'>
			{/* 
				Link bao quanh toàn bộ card để click vào bất kỳ đâu cũng chuyển trang 
				Đường dẫn: /category + category.href (ví dụ: /category/shirts)
			*/}
			<Link to={"/category" + category.href}>
				<div className='w-full h-full cursor-pointer'>
					
					{/* Overlay gradient tối ở phía dưới để chữ dễ đọc hơn */}
					<div className='absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 opacity-50 z-10' />

					{/* Hình ảnh đại diện cho danh mục */}
					<img
						src={category.imageUrl}
						alt={category.name}
						className='w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110'
						loading='lazy'           // Tối ưu loading (chỉ load khi gần vào viewport)
					/>

					{/* Phần thông tin text ở phía dưới */}
					<div className='absolute bottom-0 left-0 right-0 p-4 z-20'>
						{/* Tên danh mục */}
						<h3 className='text-white text-2xl font-bold mb-2'>
							{category.name}
						</h3>
						
						{/* Mô tả ngắn */}
						<p className='text-gray-200 text-sm'>
							Explore {category.name}
						</p>
					</div>
				</div>
			</Link>
		</div>
	);
};

export default CategoryItem;