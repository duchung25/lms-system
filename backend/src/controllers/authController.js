import authService from "../services/authService.js";
import User from "../models/User.js";

const authController = {
    async register(req, res, next) {
        try{
            const result = await authService.register(req.body);
            res.status(201).json(result);
        }
        catch (error) {
            next(error);
        }
    },  
    async login(req, res, next) {
        try{
            const result = await authService.login(req.body);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    },
    // users/profile
    async getProfile(req, res, next) {
        try{
            const user = await User.findById(req.user.userId);
            
            res.status(200).json({
                success: true,
                message: "Lấy thông tin người dùng thành công",
                data: user
            });
        }
        catch (error) {
            next(error);
        }
    },
    async createCourse(req, res, next) {
        try {
            // Logic to create a course
            res.status(201).json({
                success: true,
                message: "Course created successfully",
                data: {
                    courseName: "New Course",
                    createBy: req.user.userId
                }
            });
        } catch (error) {
            next(error);
        }  
    },
    async deleteUser(req, res, next) {
        try {
            // Logic to delete a course
            res.json({
                success: true,
                message: "Course deleted successfully",
                data: {
                    deletedUserID: req.params.id,
                    deletedBy: req.user.userId
                }
            });
        } catch (error) {
            next(error);
        }
    },
    async updateProfile(req, res, next) {
        try{
            const userId = req.user.userId;
            const user = await User.find
        }
        catch (error) {
            next(error);
        }
    },
    async changePassword(req, res, next) {}
}

export default authController;