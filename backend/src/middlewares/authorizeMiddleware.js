import AppError from "../utils/AppError.js";

const authorizeMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError("Please login first", 401));
        }

        if (!req.user.role) {
            return next(new AppError("User role not found", 403));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(new AppError("Access denied: insufficient permissions", 403));
        }

        next();
    };
};

export default authorizeMiddleware;