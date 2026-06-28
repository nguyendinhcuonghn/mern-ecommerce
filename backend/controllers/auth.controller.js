import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

/**
 * Tạo Access Token và Refresh Token
 * @param {string} userId - ID của user trong database
 * @returns {Object} - { accessToken, refreshToken }
 */
const generateTokens = (userId) => {
	const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m", // Access token chỉ sống 15 phút
	});

	const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d", // Refresh token sống 7 ngày
	});

	return { accessToken, refreshToken };
};

/**
 * Lưu Refresh Token vào Redis
 * Mục đích: Kiểm tra tính hợp lệ của refresh token khi user yêu cầu refresh
 * @param {string} userId 
 * @param {string} refreshToken 
 */
const storeRefreshToken = async (userId, refreshToken) => {
	await redis.set(
		`refresh_token:${userId}`, 
		refreshToken, 
		"EX", 
		7 * 24 * 60 * 60 // 7 ngày (đơn vị: giây)
	);
};

/**
 * Thiết lập cookie cho trình duyệt
 * - httpOnly: true → JavaScript không đọc được (ngăn XSS)
 * - secure: true ở production → Chỉ gửi qua HTTPS
 * - sameSite: "strict" → Ngăn CSRF attack
 */
const setCookies = (res, accessToken, refreshToken) => {
	// Cookie cho Access Token (ngắn hạn)
	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 15 * 60 * 1000, // 15 phút
	});

	// Cookie cho Refresh Token (dài hạn)
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
	});
};

// ====================== ĐĂNG KÝ ======================
export const signup = async (req, res) => {
	console.log("[AUTH] signup request body:", JSON.stringify(req.body));
	const { email, password, name } = req.body;

	try {
		// Kiểm tra user đã tồn tại chưa
		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}
		console.log("Creating new user:", { name, email });
		// Tạo user mới (password sẽ được hash trong model User trước khi lưu)
		const user = await User.create({ name, email, password });

		// Tạo token và lưu refresh token vào Redis
		const { accessToken, refreshToken } = generateTokens(user._id);
		await storeRefreshToken(user._id, refreshToken);

		// Gửi cookie về client
		setCookies(res, accessToken, refreshToken);

		// Trả về thông tin user (không trả password)
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
		});
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ message: error.message });
	}
};

// ====================== ĐĂNG NHẬP ======================
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		// Tìm user theo email
		const user = await User.findOne({ email });

		// Kiểm tra user tồn tại và password đúng không
		if (user && (await user.comparePassword(password))) {
			const { accessToken, refreshToken } = generateTokens(user._id);
			await storeRefreshToken(user._id, refreshToken);

			setCookies(res, accessToken, refreshToken);

			res.json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			});
		} else {
			res.status(400).json({ message: "Invalid email or password" });
		}
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ message: error.message });
	}
};

// ====================== ĐĂNG XUẤT ======================
export const logout = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		// Nếu có refresh token → xóa khỏi Redis
		if (refreshToken) {
			const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
			await redis.del(`refresh_token:${decoded.userId}`);
		}

		// Xóa cookie ở trình duyệt
		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");

		res.json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// ====================== LÀM MỚI ACCESS TOKEN ======================
export const refreshToken = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			return res.status(401).json({ message: "No refresh token provided" });
		}

		// Giải mã refresh token
		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

		// Kiểm tra refresh token có trong Redis không
		const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

		if (storedToken !== refreshToken) {
			return res.status(401).json({ message: "Invalid refresh token" });
		}

		// Tạo access token mới
		const accessToken = jwt.sign(
			{ userId: decoded.userId }, 
			process.env.ACCESS_TOKEN_SECRET, 
			{ expiresIn: "15m" }
		);

		// Gửi access token mới vào cookie
		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 15 * 60 * 1000,
		});

		res.json({ message: "Token refreshed successfully" });
	} catch (error) {
		console.log("Error in refreshToken controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// ====================== LẤY THÔNG TIN PROFILE ======================
export const getProfile = async (req, res) => {
	try {
		// req.user được gán bởi middleware protectRoute
		res.json(req.user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};