import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ 
            success: false,
            message: "Access token is required"
         });
    }
    const token = authHeader.split(" ")[1];
    // Verify token
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(error) {
        if(error.name === "TokenExpiredError") {
            return res.status(401).json({ 
                success: false,
                message: "Token expired" });
        }
        return res.status(401).json({ 
            success: false,
            message: "Invalid token, authorization denied"
         });
    }
};

export default authMiddleware;