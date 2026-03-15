import User from "../models/User.js";

const adminController = {
    async getAllUsers(req, res, next) {
        try {
            const users = await User.find();
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }
};

export default adminController;