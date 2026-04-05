import User from "../models/User.js";
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";

const authService = {
    async register(userData) {
        const { username, email, password } = userData;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new AppError("Email đã được sử dụng", 400);
        }
        const hashedPassword = await bcryptjs.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });   
        return {
            message: "Created user successfully",
            user
        };
    },
    async login(userData){
        const { email, password } = userData;
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            throw new AppError("Thông tin đăng nhập không hợp lệ", 401);
        }
        if(!user.active){
            throw new AppError("Tài khoản đã bị vô hiệu hóa, vui lòng liên hệ quản trị viên", 403);
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if(!isMatch){
            throw new AppError("Thông tin đăng nhập không hợp lệ", 401);
        }
        const token = jwt.sign(
            { userId: user._id,
                role: user.role
             },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        const { password: _, ...userWithoutPassword } = user.toObject();
        return {
            message: "Login successful",
            token,
            user: userWithoutPassword
        };
    },
    async getUserProfile(userId) {
        const user = await User.findById(userId).lean();
        if(!user){
            throw new AppError("Người dùng không tồn tại", 404);
        }
        return user;
    },
    async updateUserProfile(userId, updateData) {
        const allowedFields = ["username", "avatar"];
        const fieldsToUpdate = {};
        for (let key of allowedFields) {
            if (updateData[key] !== undefined) {
                fieldsToUpdate[key] = updateData[key];
            }
        }
        const user = await User.findById(
            userId
        );
        if(!user){
            throw new AppError("Người dùng không tồn tại", 404);
        }
        if(!user.active) {
            throw new AppError("Tài khoản đã bị vô hiệu hóa, vui lòng liên hệ quản trị viên", 403);
        }
        Object.assign(user, fieldsToUpdate);
        await user.save();
        return user.toObject();
    },
    async changeUserPassword(userId, currentPassword, newPassword) {
        const user = await User.findById(userId).select("+password");
        if(!user){
            throw new AppError("Người dùng không tồn tại", 404);
        }
        if(!user.active){
            throw new AppError("Tài khoản đã bị vô hiệu hóa, vui lòng liên hệ quản trị viên", 403);
        }
        const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);
        if(!isPasswordValid){
            throw new AppError("Mật khẩu hiện tại không đúng", 400);
        }
        const hashedNewPassword = await bcryptjs.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();
        return { message: "Đổi mật khẩu thành công" };
    }
};

export default authService;