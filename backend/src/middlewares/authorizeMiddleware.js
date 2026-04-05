import AppError from "../utils/AppError.js";

const authorizeMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        try{
            const userRole = req.user.role;
            if(!allowedRoles.includes(userRole)) {
                return next(new AppError("Access denied: insufficient permissions", 403));
            }
            next();
        } catch (error) {
            next(error);
        }
    };
}

export default authorizeMiddleware;