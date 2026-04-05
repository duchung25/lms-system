import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new AppError("No token provided, authorization denied", 401));
    }
    const token = authHeader.split(" ")[1];
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(error) {
        if(error.name === "TokenExpiredError") {
            return next(new AppError("Token expired, please log in again", 401));
        }
        return next(new AppError("Invalid token, authorization denied", 401));
    }
};

export default authMiddleware;