import User from '../models/User.js';
import bcryptjs from 'bcryptjs';

const adminService = {
    async getAllUsers() {
        const users = await User.find().select("-password");
        if(!users||users.length === 0){
            throw new Error("Không có người dùng nào");
        }
        return users;
    },
    async getUserById(userId) {
        const user = await User.findById(userId).select("-password");
        if(!user){
        throw new Error("Người dùng không tồn tại");
        }
        return user;
    },
    async getUserByEmail(email) {
        const user = await User.findOne({ email }).select("-password");
        if(!user){
            throw new Error("Người dùng không tồn tại");
        }
        return user;
    },
    async deleteUser(userId){
        const user = await User.findById(userId);
        if(!user){
            throw new Error("Người dùng không tồn tại");
        }
        await User.delete({ _id: userId });
        return {
            message: "Xóa người dùng thành công",
            deletedUserId: userId
        };
    },
    async restoreUser(userId){
        const user = await User.findWithDeleted({ _id: userId });
        if(!user){
            throw new Error("Người dùng không tồn tại");
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
            { active: "inactive" },
            { new: true, runValidators: true }
        ).select("-password");
        if(!user){
            throw new Error("Người dùng không tồn tại");
        }
        return {
            message: "Vô hiệu hóa người dùng thành công",
            user
        };
    },
    async resetPassword(userId, newPassword) {
        const user = await User.findById(userId);
        if(!user){
            throw new Error("Người dùng không tồn tại");
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