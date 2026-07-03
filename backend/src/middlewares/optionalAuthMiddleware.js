import jwt from "jsonwebtoken";

const optionalAuthMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        req.user = undefined;
        return next();
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (error) {
        // Token invalid/expired -> coi như guest, không chặn request
        req.user = undefined;
    }

    next();
};

export default optionalAuthMiddleware;