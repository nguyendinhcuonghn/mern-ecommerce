import { motion } from "framer-motion";
import { Trash, Star } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

/**
 * Component ProductsList - Danh sách sản phẩm cho Admin Dashboard
 * Hiển thị dưới dạng bảng với các chức năng quản lý
 */
const ProductsList = () => {
	// Lấy dữ liệu và hàm từ Product Store (Zustand)
	const { deleteProduct, toggleFeaturedProduct, products } = useProductStore();

	console.log("products", products);   // Dùng để debug

	return (
		<motion.div
			className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<table className='min-w-full divide-y divide-gray-700'>
				{/* Phần tiêu đề bảng */}
				<thead className='bg-gray-700'>
					<tr>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Sản phẩm
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Giá
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Danh mục
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Nổi bật
						</th>
						<th
							scope='col'
							className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'
						>
							Hành động
						</th>
					</tr>
				</thead>

				{/* Phần nội dung bảng */}
				<tbody className='bg-gray-800 divide-y divide-gray-700'>
					{products?.map((product) => (
						<tr key={product._id} className='hover:bg-gray-700'>
							
							{/* Cột Sản phẩm (ảnh + tên) */}
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='flex items-center'>
									<div className='flex-shrink-0 h-10 w-10'>
										<img
											className='h-10 w-10 rounded-full object-cover'
											src={product.image}
											alt={product.name}
										/>
									</div>
									<div className='ml-4'>
										<div className='text-sm font-medium text-white'>
											{product.name}
										</div>
									</div>
								</div>
							</td>

							{/* Cột Giá */}
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='text-sm text-gray-300'>
									{product.price.toLocaleString()} ₫
								</div>
							</td>

							{/* Cột Danh mục */}
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='text-sm text-gray-300'>
									{product.category}
								</div>
							</td>

							{/* Cột Nổi bật (Featured) */}
							<td className='px-6 py-4 whitespace-nowrap'>
								<button
									onClick={() => toggleFeaturedProduct(product._id)}
									className={`p-1 rounded-full ${product.isFeatured 
										? "bg-yellow-400 text-gray-900" 
										: "bg-gray-600 text-gray-300"
									} hover:bg-yellow-500 transition-colors duration-200`}
								>
									<Star className='h-5 w-5' />
								</button>
							</td>

							{/* Cột Hành động */}
							<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
								<button
									onClick={() => deleteProduct(product._id)}
									className='text-red-400 hover:text-red-300'
								>
									<Trash className='h-5 w-5' />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</motion.div>
	);
};

export default ProductsList;