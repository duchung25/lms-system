import adminService from "../services/adminService.js";

const adminController = {
    async getAllUsers(req, res, next){
        try{
            const querryParams = req.query;
            const userList = await adminService.getAllUsers(querryParams);
            res.status(200).json({
                success: true,
                message: userList.users.length > 0 ? "Lấy danh sách người dùng thành công" : "Không có người dùng nào",
                data: { users: userList.users, 
                        total: userList.total, 
                        page: userList.page, 
                        limit: userList.limit, 
                        totalPages: userList.totalPages 
        }
            });
        } catch (error) {
            next(error);

        }
    },
    async getUserById(req, res, next){
        try{
            const { id } = req.params;
            const user = await adminService.getUserById(id);
            res.status(200).json({
                success: true,
                message: "Lấy thông tin chi tiết thành công",
                data: { user }
            })
        } catch (error) {
            next(error);
        }
    },
    async getUserByEmail(req, res, next){
        try{
            const {email} = req.query;
            const user = await adminService.getUserByEmail(email);
            res.status(200).json({
                success: true,
                message: "Lấy thông tin chi tiết thành công",
                data: { user }
            })
        }
        catch (error) {
            next(error);
        }
    },
    async deleteUser(req, res, next){
        try{
            const { id } = req.params;
            const result = await adminService.deleteUser(id);
            res.status(200).json({
                success: true,
                message: result.message,
                data: { deletedUserId: result.deletedUserId }
            });
        }catch(error){
            next(error);
        }
    },
    async restoreUser(req, res, next){
        try{
            const {id} = req.params;
            const result = await adminService.restoreUser(id);
            res.status(200).json({
                success: true,
                message: result.message,
                data: { restoredUserId: result.restoredUserId }
            })
        }
        catch(error){
            next(error);
        }
    },
    async deactivateUser(req, res, next){
        try{
            const {id} = req.params;
            const result = await adminService.deactivateUser(id);
            res.status(200).json({
                success: true,
                message: result.message,
                data: { user: result.user }
            });
        }
        catch(error){
            next(error);
        }
    },
    async resetPassword(req, res, next){
        try{
            const { id } = req.params;
            const { newPassword } = req.body;
            const result = await adminService.resetPassword(id, newPassword);
            res.status(200).json({
                success: true,
                message: result.message,
                data: null
            });
        }
        catch(error){
            next(error);
        }
    },
}

export default adminController;