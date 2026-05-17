import authService from "../services/authService.js";

const authController = {
    async register(req, res, next) {
        try{
            const result = await authService.register(req.body);
            res.status(201).json({
                success: true,
                message: result.message,
                data: { user: result.user }
            });
        }
        catch (error) {
            next(error);
        }
    },  
    async login(req, res, next) {
        try{
            const result = await authService.login(req.body);
            res.status(200).json({
                success: true,
                message: result.message,
                data: {
                    token: result.token,
                    user: result.user
                }
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getProfile(req, res, next) {
        try{
            const userId = req.user.userId;
            const user = await authService.getUserProfile(userId);
            res.status(200).json({
                success: true,
                message: "Lấy thông tin người dùng thành công",
                data: { user }
            });
        }
        catch (error) {
            next(error);
        }
    },
   async updateProfile(req, res, next) {
        try{
            const userId = req.user.userId;
            const user = await authService.updateUserProfile(userId, req.body);
            res.status(200).json({
                success: true,
                message: "Cập nhật thông tin người dùng thành công",
                data: { user }
            });
        }
        catch (error) {
            next(error);
        }
    },
    async changePassword(req, res, next) {
        try{
            const userId = req.user.userId;
            const { currentPassword, newPassword } = req.body;
            await authService.changeUserPassword(userId, currentPassword, newPassword);
            res.status(200).json({
                success: true,
                message: "Đổi mật khẩu thành công",
                data: null
            });
        }
        catch (error) {
            next(error);
        }
    },
}

export default authController;