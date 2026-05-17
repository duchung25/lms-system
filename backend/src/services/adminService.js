import User from '../models/User.js';
import bcryptjs from 'bcryptjs';
import AppError from '../utils/AppError.js';

const adminService = {
    async getAllUsers(querryParams) {
        const {
            role,
            active,
            deleted,
            search,
            page = 1,
            limit = 5,
            sort = "-createdAt",
        } = querryParams;
        const filter = {};
        if (role) {
            filter.role = role;
        }
        if(active !== undefined && active !== ""){
            filter.active = active === "true";
        }
        if(deleted !== undefined && deleted !== ""){
            filter.deleted = deleted === "true";
        }
        if(search){
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        const users = await User.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();
        const total = await User.countDocuments(filter);
        return {
            users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    },
    async getUserById(userId) {
        const user = await User.findById(userId);
        if(!user){
        throw new AppError("Người dùng không tồn tại", 404);
        }
        return user;
    },
    async getUserByEmail(email) {
        const user = await User.findOne({ email }.lean());
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