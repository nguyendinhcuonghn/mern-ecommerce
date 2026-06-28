import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

/**
 * Lấy dữ liệu tổng quan analytics (dashboard)
 * Bao gồm: tổng số user, sản phẩm, đơn hàng và doanh thu
 */
export const getAnalyticsData = async () => {
	// Đếm tổng số người dùng
	const totalUsers = await User.countDocuments();

	// Đếm tổng số sản phẩm
	const totalProducts = await Product.countDocuments();

	// Sử dụng MongoDB Aggregation để tính tổng đơn hàng và doanh thu
	const salesData = await Order.aggregate([
		{
			$group: {
				_id: null, // Gom tất cả documents lại thành 1 group
				totalSales: { $sum: 1 },           // Tổng số đơn hàng
				totalRevenue: { $sum: "$totalAmount" }, // Tổng doanh thu
			},
		},
	]);

	// Nếu không có dữ liệu thì gán mặc định là 0
	const { totalSales, totalRevenue } = salesData[0] || { totalSales: 0, totalRevenue: 0 };

	// Trả về object chứa tất cả dữ liệu analytics
	return {
		users: totalUsers,
		products: totalProducts,
		totalSales,
		totalRevenue,
	};
};

/**
 * Lấy dữ liệu doanh số theo ngày trong khoảng thời gian nhất định
 * Dùng để vẽ biểu đồ doanh thu theo ngày
 * 
 * @param {Date} startDate - Ngày bắt đầu
 * @param {Date} endDate - Ngày kết thúc
 */
export const getDailySalesData = async (startDate, endDate) => {
	try {
		// Aggregation pipeline để lấy doanh số theo ngày
		const dailySalesData = await Order.aggregate([
			{
				// Lọc đơn hàng trong khoảng thời gian
				$match: {
					createdAt: {
						$gte: startDate,
						$lte: endDate,
					},
				},
			},
			{
				// Nhóm theo ngày và tính tổng
				$group: {
					_id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
					sales: { $sum: 1 },                    // Số lượng đơn hàng trong ngày
					revenue: { $sum: "$totalAmount" },     // Doanh thu trong ngày
				},
			},
			// Sắp xếp theo ngày tăng dần
			{ $sort: { _id: 1 } },
		]);

		// Tạo mảng chứa tất cả các ngày trong khoảng thời gian
		const dateArray = getDatesInRange(startDate, endDate);

		// Map qua tất cả các ngày để đảm bảo có dữ liệu cho mọi ngày
		// (ngày nào không có đơn hàng thì sales = 0, revenue = 0)
		return dateArray.map((date) => {
			const foundData = dailySalesData.find((item) => item._id === date);

			return {
				date,
				sales: foundData?.sales || 0,
				revenue: foundData?.revenue || 0,
			};
		});
	} catch (error) {
		throw error;
	}
};

/**
 * Hàm hỗ trợ: Tạo danh sách tất cả các ngày trong khoảng thời gian
 * @param {Date} startDate 
 * @param {Date} endDate 
 * @returns {string[]} Mảng các ngày dạng YYYY-MM-DD
 */
function getDatesInRange(startDate, endDate) {
	const dates = [];
	let currentDate = new Date(startDate);

	// Duyệt từng ngày từ startDate đến endDate
	while (currentDate <= endDate) {
		// Chuyển về định dạng YYYY-MM-DD
		dates.push(currentDate.toISOString().split("T")[0]);
		
		// Tăng ngày lên 1
		currentDate.setDate(currentDate.getDate() + 1);
	}

	return dates;
}