import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCartStore } from "../stores/useCartStore";

/**
 * Component GiftCouponCard - Quản lý mã giảm giá / Voucher / Gift Card
 */
const GiftCouponCard = () => {
	// State lưu mã coupon người dùng nhập vào
	const [userInputCode, setUserInputCode] = useState("");

	// Lấy dữ liệu và hàm từ Cart Store (Zustand)
	const { 
		coupon, 
		isCouponApplied, 
		applyCoupon, 
		getMyCoupon, 
		removeCoupon 
	} = useCartStore();

	/**
	 * Lấy coupon cá nhân của user khi component mount
	 */
	useEffect(() => {
		getMyCoupon();
	}, [getMyCoupon]);

	/**
	 * Đồng bộ input với coupon đã có (nếu user có coupon sẵn)
	 */
	useEffect(() => {
		if (coupon) {
			setUserInputCode(coupon.code);
		}
	}, [coupon]);

	/**
	 * Áp dụng coupon
	 */
	const handleApplyCoupon = () => {
		if (!userInputCode.trim()) return;
		applyCoupon(userInputCode);
	};

	/**
	 * Xóa coupon đã áp dụng
	 */
	const handleRemoveCoupon = async () => {
		await removeCoupon();
		setUserInputCode("");   // Reset input
	};

	return (
		<motion.div
			className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.2 }}
		>
			<div className='space-y-4'>
				{/* Input nhập mã coupon */}
				<div>
					<label htmlFor='voucher' className='mb-2 block text-sm font-medium text-gray-300'>
						Bạn có mã giảm giá hoặc voucher không?
					</label>
					<input
						type='text'
						id='voucher'
						className='block w-full rounded-lg border border-gray-600 bg-gray-700 
            p-2.5 text-sm text-white placeholder-gray-400 focus:border-emerald-500 
            focus:ring-emerald-500'
						placeholder='Nhập mã voucher tại đây'
						value={userInputCode}
						onChange={(e) => setUserInputCode(e.target.value)}
						required
					/>
				</div>

				{/* Nút Apply Code */}
				<motion.button
					type='button'
					className='flex w-full items-center justify-center rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-300'
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleApplyCoupon}
				>
					Áp dụng mã
				</motion.button>
			</div>

			{/* Phần hiển thị coupon đã áp dụng */}
			{isCouponApplied && coupon && (
				<div className='mt-4'>
					<h3 className='text-lg font-medium text-emerald-400'>Đã áp dụng mã giảm giá</h3>

					<p className='mt-2 text-sm text-gray-400'>
						{coupon.code} - Giảm {coupon.discountPercentage}%
					</p>

					<motion.button
						type='button'
						className='mt-2 flex w-full items-center justify-center rounded-lg bg-red-600 
            px-5 py-2.5 text-sm font-medium text-white hover:bg-red-700 focus:outline-none
             focus:ring-4 focus:ring-red-300'
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handleRemoveCoupon}
					>
						Gỡ mã giảm giá
					</motion.button>
				</div>
			)}

			{/* Hiển thị coupon cá nhân của user (nếu có) */}
			{coupon && !isCouponApplied && (
				<div className='mt-4'>
					<h3 className='text-lg font-medium text-gray-300'>Mã giảm giá của bạn:</h3>
					<p className='mt-2 text-sm text-gray-400'>
						{coupon.code} - Giảm {coupon.discountPercentage}%
					</p>
				</div>
			)}
		</motion.div>
	);
};

export default GiftCouponCard;