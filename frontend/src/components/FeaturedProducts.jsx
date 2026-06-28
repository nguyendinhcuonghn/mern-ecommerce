import { useEffect, useState } from "react";
import { ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useCartStore } from "../stores/useCartStore";

/**
 * Component FeaturedProducts - Hiển thị carousel sản phẩm nổi bật
 * 
 * Props:
 * - featuredProducts: mảng các sản phẩm nổi bật (lấy từ API hoặc store)
 */
const FeaturedProducts = ({ featuredProducts }) => {
	// Chỉ số hiện tại của slide
	const [currentIndex, setCurrentIndex] = useState(0);
	
	// Số lượng sản phẩm hiển thị trên 1 trang (responsive)
	const [itemsPerPage, setItemsPerPage] = useState(4);

	const { addToCart } = useCartStore();

	/**
	 * Xử lý responsive: thay đổi số lượng item hiển thị theo kích thước màn hình
	 */
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 640) setItemsPerPage(1);        // Mobile
			else if (window.innerWidth < 1024) setItemsPerPage(2);  // Tablet
			else if (window.innerWidth < 1280) setItemsPerPage(3);  // Laptop
			else setItemsPerPage(4);                                // Desktop
		};

		handleResize(); // Chạy lần đầu
		window.addEventListener("resize", handleResize);
		
		// Cleanup khi component unmount
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	/**
	 * Chuyển đến slide tiếp theo
	 */
	const nextSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex + itemsPerPage);
	};

	/**
	 * Chuyển về slide trước
	 */
	const prevSlide = () => {
		setCurrentIndex((prevIndex) => prevIndex - itemsPerPage);
	};

	// Kiểm tra nút Previous có bị disable không
	const isStartDisabled = currentIndex === 0;
	
	// Kiểm tra nút Next có bị disable không
	const isEndDisabled = currentIndex >= featuredProducts.length - itemsPerPage;

	return (
		<div className='py-12'>
			<div className='container mx-auto px-4'>
				{/* Tiêu đề */}
				<h2 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
					Featured
				</h2>

				<div className='relative'>
					{/* Container cho carousel */}
					<div className='overflow-hidden'>
						<div
							className='flex transition-transform duration-300 ease-in-out'
							style={{ 
								// Di chuyển ngang theo tỷ lệ phần trăm
								transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)` 
							}}
						>
							{featuredProducts?.map((product) => (
								<div 
									key={product._id} 
									className='w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-2'
								>
									<div className='bg-white bg-opacity-10 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden h-full transition-all duration-300 hover:shadow-xl border border-emerald-500/30'>
										
										{/* Hình ảnh sản phẩm */}
										<div className='overflow-hidden'>
											<img
												src={product.image}
												alt={product.name}
												className='w-full h-48 object-cover transition-transform duration-300 ease-in-out hover:scale-110'
											/>
										</div>

										{/* Thông tin sản phẩm */}
										<div className='p-4'>
											<h3 className='text-lg font-semibold mb-2 text-white'>
												{product.name}
											</h3>
											<p className='text-emerald-300 font-medium mb-4'>
												${product.price.toFixed(2)}
											</p>
											
											{/* Nút thêm vào giỏ hàng */}
											<button
												onClick={() => addToCart(product)}
												className='w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded transition-colors duration-300 
												flex items-center justify-center'
											>
												<ShoppingCart className='w-5 h-5 mr-2' />
												Add to Cart
											</button>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					{/* Nút Previous */}
					<button
						onClick={prevSlide}
						disabled={isStartDisabled}
						className={`absolute top-1/2 -left-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
							isStartDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"
						}`}
					>
						<ChevronLeft className='w-6 h-6' />
					</button>

					{/* Nút Next */}
					<button
						onClick={nextSlide}
						disabled={isEndDisabled}
						className={`absolute top-1/2 -right-4 transform -translate-y-1/2 p-2 rounded-full transition-colors duration-300 ${
							isEndDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500"
						}`}
					>
						<ChevronRight className='w-6 h-6' />
					</button>
				</div>
			</div>
		</div>
	);
};

export default FeaturedProducts;