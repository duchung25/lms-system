import User from '../models/User.js';
import bcryptjs from 'bcryptjs';
import AppError from '../utils/AppError.js';

const adminService = {
    async getAllUsers() {
        return await User.find().lean();
    },
    async getUserById(userId) {
        const user = await User.findById(userId);
        if(!user){
        throw new AppError("Người dùng không tồn tại", 404);
        }
        return user;
    },
    async getUserByEmail(email) {
        const user = await User.findOne({ email });
        if(!user){
            throw new AppError("Người dùng không tồn tại", 404);
        }
        return user;
    },
    async deleteUser(userId){
        const user = await User.findById(userId);
        if(!user){
            throw new AppError("Người dùng không tồn tại", 404);
        }
        await user.delete();
        return {
            message: "Xóa người dùng thành công",
            deletedUserId: userId
        };
    },
    async restoreUser(userId){
        const user = await User.findWithDeleted({ _id: userId });
        if(!user || user.length === 0 ){
            throw new AppError("Người dùng không tồn tại", 404);
        }
        await User.restore({_id: userId});
        return {
            message: "Khôi phục người dùng thành công",
            restoredUserId: userId
        };
    },
    async deactivateUser(userId){
        const user = await User.findByIdAndUpdate(
            userId, 
            { active: false, deleted: false },
            { new: true, runValidators: true }
        );
        if(!user){
            throw new AppError("Người dùng không tồn tại", 404);
        }
        return {
            message: "Vô hiệu hóa người dùng thành công",
            user
        };
    },
    async resetPassword(userId, newPassword) {
        const user = await User.findById(userId);
        if(!user){
            throw new AppError("Người dùng không tồn tại", 404);
        }
        const hashedPassword = await bcryptjs.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        return{
            message: "Đặt lại mật khẩu thành công"
        };
    },
}

export default adminService;