const LoadingSpinner = () => {
	return (
		<div className='flex items-center justify-center min-h-screen bg-gray-900'>
			<div className='relative flex flex-col items-center'>
				{/* Vòng tròn nền (màu nhạt) */}
				<div className='w-20 h-20 border-emerald-200 border-2 rounded-full' />

				{/* Vòng tròn xoay (chỉ border-top có màu) */}
				<div className='w-20 h-20 border-emerald-500 border-t-2 animate-spin rounded-full absolute left-0 top-0' />

				{/* Text hiển thị cho người dùng */}
				<p className='mt-4 text-emerald-400 text-sm font-medium'>
					Đang tải...
				</p>

				{/* Text ẩn cho screen reader (accessibility) */}
				<div className='sr-only'>Đang tải</div>
			</div>
		</div>
	);
};

export default LoadingSpinner;