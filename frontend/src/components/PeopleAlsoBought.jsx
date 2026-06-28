import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import axios from "../lib/axios";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";

/**
 * Component PeopleAlsoBought - Hiển thị các sản phẩm gợi ý "Người ta cũng mua"
 * Dùng ở trang chi tiết sản phẩm hoặc trang giỏ hàng.
 */
const PeopleAlsoBought = () => {
	// State lưu danh sách sản phẩm gợi ý
	const [recommendations, setRecommendations] = useState([]);
	
	// State quản lý trạng thái loading
	const [isLoading, setIsLoading] = useState(true);

	/**
	 * Lấy danh sách sản phẩm gợi ý khi component mount
	 */
	useEffect(() => {
		const fetchRecommendations = async () => {
			try {
				// Gọi API lấy 4 sản phẩm ngẫu nhiên (backend dùng $sample)
				const res = await axios.get("/products/recommendations");
				setRecommendations(res.data);
			} catch (error) {
				// Hiển thị thông báo lỗi bằng react-hot-toast
				toast.error(error.response?.data?.message || "An error occurred while fetching recommendations");
			} finally {
				setIsLoading(false);
			}
		};

		fetchRecommendations();
	}, []);   // Chỉ chạy 1 lần khi component mount

	// Hiển thị spinner trong lúc đang tải dữ liệu
	if (isLoading) return <LoadingSpinner />;

	return (
		<div className='mt-8'>
			{/* Tiêu đề phần gợi ý */}
			<h3 className='text-2xl font-semibold text-emerald-400'>
				People also bought
			</h3>

			{/* Grid hiển thị các sản phẩm gợi ý */}
			<div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
				{recommendations.map((product) => (
					<ProductCard 
						key={product._id} 
						product={product} 
					/>
				))}
			</div>
		</div>
	);
};

export default PeopleAlsoBought;