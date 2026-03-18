const adminController = {
    // Get list admin
    async getAllAdmin(req, res, next){
        try{
            res.status(200).json({
                success: true,
                message: "Lấy danh sách thành công",
                data: []
            });
        } catch (error) {
            next(error);

        }
    },
    // Get user byId
    async getUserById(req, res, next){
        try{
            const { id } = req.params;
            res.status(200).json({
                success: true,
                message: "Lấy thông tin chi tiết thành công",
                data: {}
            })
        } catch (error) {
            next(error);
        }
    },
    // Update user byId
    async updateUserById(req, res, next){
        try{
            const { id } = req.params;
            const { username, email, role} = req.body;
            res.status(200).json({
                success: true,
                message: "Cập nhật thông tin thành công",
                data: {}
            })
        } catch (error) {
            next(error);
        }
    },
    // Delete user byId
    async deleteUserById(req, res, next){
        try{
            const { id } = req.params;
            success: true,
            res.status(200).json({
                success: true,
                message: "Xóa người dùng thành công",
                data: { deletedUserId: id }
            });
        }catch (error) {
            next(error);
        }
    },
    // Count total user
    async getState(req, res, next){
        try{
            res.status(200).json({
                success: true,
                message: "Lấy thông tin thống kê thành công",
                data: {
                    totalUsers: 0,
                    totalTeachers: 0,
                    totalStudents: 0,
                    totalAdmins: 0
                }
            });
        } catch (error) {
            next(error);
        }
    }
}

export default adminController;