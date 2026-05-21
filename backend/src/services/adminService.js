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
                { username: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        const users = await User.findWithDeleted(filter)
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
    async getDashboardStatistics() {
        const today = new Date();

        const startOfToday = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );

        const startOfMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            1
        );

        const [
            totalUsers,
            activeUsers,
            inactiveUsers,
            deletedUsers,
            totalStudents,
            totalTeachers,
            totalAdmins,
            newUsersToday,
            newUsersThisMonth,
            monthlyGrowth
        ] = await Promise.all([
            User.countDocumentsWithDeleted(),

            User.countDocuments({
                active: true,
                deleted: false
            }),

            User.countDocuments({
                active: false,
                deleted: false
            }),

            User.countDocuments({
                deleted: true
            }),

            User.countDocuments({
                role: "student",
                deleted: false
            }),

            User.countDocuments({
                role: "teacher",
                deleted: false
            }),

            User.countDocuments({
                role: "admin",
                deleted: false
            }),

            User.countDocuments({
                createdAt: {
                    $gte: startOfToday
                },
                deleted: false
            }),

            User.countDocuments({
                createdAt: {
                    $gte: startOfMonth
                },
                deleted: false
            }),

            User.aggregate([
                {
                    $match: {
                        deleted: { $ne: true }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" }
                        },
                        totalUsers: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        "_id.year": 1,
                        "_id.month": 1
                    }
                }
            ])
        ]);

        return {
            overview: {
                totalUsers,
                activeUsers,
                inactiveUsers,
                deletedUsers,
                totalStudents,
                totalTeachers,
                totalAdmins,
                newUsersToday,
                newUsersThisMonth
            },

            charts: {
                userGrowthByMonth: monthlyGrowth
            }
        };
    }
}

export default adminService;