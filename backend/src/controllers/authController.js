import authService from "../services/authService.js";

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
    }
}

export default authController;