import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash, Star, AlertTriangle, X } from "lucide-react";
import { useProductStore } from "../stores/useProductStore";
import { useState } from "react";

const ProductsList = () => {
	const { deleteProduct, toggleFeaturedProduct, products, updateProduct } = useProductStore();

	// State cho Edit Modal
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [editingProduct, setEditingProduct] = useState(null);

	// State cho Confirm Delete
	const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, productId: null, productName: "" });

	// Mở modal Edit
	const handleEdit = (product) => {
		setEditingProduct({ ...product });
		setIsEditModalOpen(true);
	};

	// Xử lý cập nhật sản phẩm
	const handleUpdate = async (e) => {
		e.preventDefault();
		if (editingProduct && updateProduct) {
			await updateProduct(editingProduct._id, editingProduct);
			setIsEditModalOpen(false);
			setEditingProduct(null);
		}
	};

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;
		setEditingProduct(prev => ({
			...prev,
			[name]: type === "checkbox" ? checked : 
			        name === "price" ? parseFloat(value) || 0 : value
		}));
	};

	// Xóa với confirm
	const handleDeleteClick = (productId, productName) => {
		setDeleteConfirm({ isOpen: true, productId, productName });
	};

	const confirmDelete = () => {
		if (deleteConfirm.productId) deleteProduct(deleteConfirm.productId);
		setDeleteConfirm({ isOpen: false, productId: null, productName: "" });
	};

	const cancelDelete = () => {
		setDeleteConfirm({ isOpen: false, productId: null, productName: "" });
	};

	return (
		<motion.div
			className='bg-gray-800 shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
		>
			<table className='min-w-full divide-y divide-gray-700'>
				<thead className='bg-gray-700'>
					<tr>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Sản phẩm</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Giá</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Danh mục</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Nổi bật</th>
						<th className='px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider'>Hành động</th>
					</tr>
				</thead>

				<tbody className='bg-gray-800 divide-y divide-gray-700'>
					{products?.map((product) => (
						<tr key={product._id} className='hover:bg-gray-700'>
							<td className='px-6 py-4 whitespace-nowrap'>
								<div className='flex items-center'>
									<div className='flex-shrink-0 h-10 w-10'>
										<img className='h-10 w-10 rounded-full object-cover' src={product.image} alt={product.name} />
									</div>
									<div className='ml-4'>
										<div className='text-sm font-medium text-white'>{product.name}</div>
									</div>
								</div>
							</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{product.price?.toLocaleString()} ₫</td>
							<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-300'>{product.category}</td>
							<td className='px-6 py-4 whitespace-nowrap'>
								<button onClick={() => toggleFeaturedProduct(product._id)} className={`p-1 rounded-full ${product.isFeatured ? "bg-yellow-400 text-gray-900" : "bg-gray-600 text-gray-300"} hover:bg-yellow-500`}>
									<Star className='h-5 w-5' />
								</button>
							</td>
							<td className='px-6 py-4 whitespace-nowrap flex gap-4'>
								<button onClick={() => handleEdit(product)} className='text-blue-400 hover:text-blue-300' title="Sửa">
									<Pencil className='h-5 w-5' />
								</button>
								<button onClick={() => handleDeleteClick(product._id, product.name)} className='text-red-400 hover:text-red-300' title="Xóa">
									<Trash className='h-5 w-5' />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>

			{/* ==================== MODAL EDIT ==================== */}
			<AnimatePresence>
				{isEditModalOpen && editingProduct && (
					<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							className="bg-gray-800 rounded-2xl p-8 max-w-lg w-full"
						>
							<div className="flex justify-between items-center mb-6">
								<h2 className="text-2xl font-semibold text-emerald-300">Sửa Sản Phẩm</h2>
								<button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-white">
									<X className="h-6 w-6" />
								</button>
							</div>

							<form onSubmit={handleUpdate} className="space-y-5">
								<input type="text" name="name" value={editingProduct.name} onChange={handleInputChange} placeholder="Tên sản phẩm" className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white" required />
								<input type="number" name="price" value={editingProduct.price} onChange={handleInputChange} placeholder="Giá" className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white" required />
								<input type="text" name="category" value={editingProduct.category} onChange={handleInputChange} placeholder="Danh mục" className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white" required />
								
								<div className="flex items-center gap-2">
									<input type="checkbox" name="isFeatured" checked={editingProduct.isFeatured} onChange={handleInputChange} className="w-5 h-5" />
									<label className="text-gray-300">Sản phẩm nổi bật</label>
								</div>

								<div className="flex gap-4 pt-4">
									<button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg">Hủy</button>
									<button type="submit" className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg">Lưu thay đổi</button>
								</div>
							</form>
						</motion.div>
					</div>
				)}
			</AnimatePresence>

			{/* ==================== CONFIRM DELETE MODAL ==================== */}
			<AnimatePresence>
				{deleteConfirm.isOpen && (
					<div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							className="bg-gray-800 rounded-xl p-8 max-w-md w-full border border-red-500/30"
						>
							<div className="flex flex-col items-center text-center">
								<div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
									<AlertTriangle className="w-10 h-10 text-red-500" />
								</div>
								<h3 className="text-2xl font-semibold text-white mb-2">Xác nhận xóa</h3>
								<p className="text-gray-400 mb-8">
									Bạn có chắc chắn muốn xóa<br />
									<span className="font-medium text-white">"{deleteConfirm.productName}"</span>?
								</p>
								<div className="flex gap-4 w-full">
									<button onClick={cancelDelete} className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">Hủy</button>
									<button onClick={confirmDelete} className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium">Xóa ngay</button>
								</div>
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</motion.div>
	);
};

export default ProductsList;