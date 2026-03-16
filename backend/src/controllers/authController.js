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
            if(!user) {
                return res.status(404).json({ 
                    success: false,
                    message: "User not found"
                 });
            }
            const { password, ...userWithoutPassword } = user.toObject();
            res.json({
                success: true,
                message: "User profile retrieved successfully",
                user: userWithoutPassword
            });
        }   
        catch (error) {
            next(error);
        }
    }
}

export default authController;