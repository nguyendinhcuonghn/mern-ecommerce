import { useEffect } from "react";
import CategoryItem from "../components/CategoryItem";
import { useProductStore } from "../stores/useProductStore";
import FeaturedProducts from "../components/FeaturedProducts";

const categories = [
	{ href: "/web-development", name: "Web Development", imageUrl: "/images/categories/web-dev.jpg" },
	{ href: "/mobile-app", name: "Ứng dụng Mobile", imageUrl: "/images/categories/mobile.jpg" },
	{ href: "/data-science", name: "Data Science", imageUrl: "/images/categories/data-science.jpg" },
	{ href: "/design", name: "Thiết kế", imageUrl: "/images/categories/design.jpg" },
	{ href: "/marketing", name: "Marketing", imageUrl: "/images/categories/marketing.jpg" },
	{ href: "/business", name: "Kinh doanh", imageUrl: "/images/categories/business.jpg" },
	{ href: "/other", name: "Khác", imageUrl: "/images/categories/other.jpg" },
];

const HomePage = () => {
	const { fetchFeaturedProducts, products, isLoading } = useProductStore();

	useEffect(() => {
		fetchFeaturedProducts();
	}, [fetchFeaturedProducts]);

	return (
		<div className='relative min-h-screen text-white overflow-hidden'>
			<div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16'>
				<h1 className='text-center text-5xl sm:text-6xl font-bold text-emerald-400 mb-4'>
					Khám Phá Các Danh Mục
				</h1>
				<p className='text-center text-xl text-gray-300 mb-12'>
					Học lập trình với những khóa học chất lượng cao và thực tế nhất
				</p>

				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
					{categories.map((category) => (
						<CategoryItem category={category} key={category.name} />
					))}
				</div>

				{!isLoading && products.length > 0 && <FeaturedProducts featuredProducts={products} />}
			</div>
		</div>
	);
};

export default HomePage;