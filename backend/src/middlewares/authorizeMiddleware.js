const authorizeMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        try{
            // Lấy role của người dùng 
            const userRole = req.user.role;
            // check role 
            if(!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied: insufficient permissions'
                });
            }
            next();
        } catch (error) {
            next(error);
        }
    };
}

export default authorizeMiddleware;