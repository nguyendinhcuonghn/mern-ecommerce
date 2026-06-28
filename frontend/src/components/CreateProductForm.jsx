import { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Upload, Loader } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";

// Danh sách các danh mục sản phẩm (bạn có thể chỉnh lại cho phù hợp với e-learning)
const categories = [
	"web-development", 
	"mobile-app", 
	"data-science", 
	"design", 
	"marketing", 
	"business", 
	"other"
];

const CreateProductForm = () => {
	// State quản lý form
	const [newProduct, setNewProduct] = useState({
		name: "",
		description: "",
		price: "",
		category: "",
		image: "",           // Lưu dưới dạng base64
	});

	// Lấy hàm createProduct và trạng thái loading từ Zustand store
	const { createProduct, loading } = useProductStore();

	/**
	 * Xử lý submit form
	 */
	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			await createProduct(newProduct);
			
			// Reset form sau khi tạo thành công
			setNewProduct({ 
				name: "", 
				description: "", 
				price: "", 
				category: "", 
				image: "" 
			});
		} catch (error) {
			console.error("Lỗi khi tạo sản phẩm:", error);
		}
	};

	/**
	 * Xử lý khi user chọn ảnh
	 * Chuyển file thành base64 để gửi lên server
	 */
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();

			reader.onloadend = () => {
				setNewProduct({ ...newProduct, image: reader.result });
			};

			reader.readAsDataURL(file);
		}
	};

	return (
		<motion.div
			className='bg-gray-800 shadow-lg rounded-lg p-8 mb-8 max-w-xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<h2 className='text-2xl font-semibold mb-6 text-emerald-300'>
				Tạo Sản Phẩm Mới
			</h2>

			<form onSubmit={handleSubmit} className='space-y-4'>
				
				{/* === TÊN SẢN PHẨM === */}
				<div>
					<label htmlFor='name' className='block text-sm font-medium text-gray-300'>
						Tên sản phẩm / Khóa học
					</label>
					<input
						type='text'
						id='name'
						name='name'
						value={newProduct.name}
						onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2
						 px-3 text-white focus:outline-none focus:ring-2
						focus:ring-emerald-500 focus:border-emerald-500'
						required
					/>
				</div>

				{/* === MÔ TẢ === */}
				<div>
					<label htmlFor='description' className='block text-sm font-medium text-gray-300'>
						Mô tả
					</label>
					<textarea
						id='description'
						name='description'
						value={newProduct.description}
						onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
						rows='4'
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm
						 py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 
						 focus:border-emerald-500'
						required
					/>
				</div>

				{/* === GIÁ === */}
				<div>
					<label htmlFor='price' className='block text-sm font-medium text-gray-300'>
						Giá (VND)
					</label>
					<input
						type='number'
						id='price'
						name='price'
						value={newProduct.price}
						onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
						step='1000'
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm 
						py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500
						 focus:border-emerald-500'
						required
					/>
				</div>

				{/* === DANH MỤC === */}
				<div>
					<label htmlFor='category' className='block text-sm font-medium text-gray-300'>
						Danh mục
					</label>
					<select
						id='category'
						name='category'
						value={newProduct.category}
						onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
						className='mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md
						 shadow-sm py-2 px-3 text-white focus:outline-none 
						 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
						required
					>
						<option value=''>Chọn danh mục</option>
						{categories.map((category) => (
							<option key={category} value={category}>
								{category === "web-development" ? "Web Development" :
								 category === "mobile-app" ? "Ứng dụng Mobile" :
								 category === "data-science" ? "Khoa học Dữ liệu" :
								 category === "design" ? "Thiết kế" :
								 category === "marketing" ? "Marketing" :
								 category === "business" ? "Kinh doanh" : "Khác"}
							</option>
						))}
					</select>
				</div>

				{/* === UPLOAD ẢNH === */}
				<div className='mt-1 flex items-center'>
					<input 
						type='file' 
						id='image' 
						className='sr-only' 
						accept='image/*' 
						onChange={handleImageChange} 
					/>
					
					<label
						htmlFor='image'
						className='cursor-pointer bg-gray-700 py-2 px-3 border border-gray-600 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500'
					>
						<Upload className='h-5 w-5 inline-block mr-2' />
						Tải ảnh lên
					</label>

					{newProduct.image && (
						<span className='ml-3 text-sm text-emerald-400'>✓ Đã tải ảnh</span>
					)}
				</div>

				{/* === NÚT TẠO === */}
				<button
					type='submit'
					className='w-full flex justify-center py-3 px-4 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50'
					disabled={loading}
				>
					{loading ? (
						<>
							<Loader className='mr-2 h-5 w-5 animate-spin' />
							Đang tạo...
						</>
					) : (
						<>
							<PlusCircle className='mr-2 h-5 w-5' />
							Tạo sản phẩm mới
						</>
					)}
				</button>
			</form>
		</motion.div>
	);
};

export default CreateProductForm;