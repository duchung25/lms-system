import teacherRequestService from "../services/teacherRequestService.js";

const teacherRequestController = {
    async createTeacherRequest(req, res, next) {
        try{
            const userId = req.user.userId;
            const { message } = req.body;
            const teacherRequest = await teacherRequestService.createTeacherRequest(userId, message);
            res.status(201).json({
                success: true,
                message: "Teacher request created successfully",
                data: teacherRequest
            });
        }
        catch(error){
            next(error);
        }
    },
    async getMyRequest(req, res, next) {
        try{
            const userId = req.user.userId;
            const teacherRequest = await teacherRequestService.getMyRequest(userId);
            res.status(200).json({
                success: true,
                message: "Teacher request retrieved successfully",
                data: teacherRequest
            });
        }
        catch(error){
            next(error);
        }
    },
    async getAllTeacherRequests(req, res, next) {
        try{
            const { status } = req.query;
            const teacherRequests = await teacherRequestService.getAllTeacherRequests({status});
            res.status(200).json({
                success: true,
                message: "Teacher requests retrieved successfully",
                data: teacherRequests
            });
        }
        catch(error){
            next(error);
        }

    },
    async approveTeacherRequest(req, res, next) {
        try{
            const { id } = req.params;
            const reviewerId = req.user.userId;
            const result= await teacherRequestService.approveTeacherRequest(id, reviewerId);
            res.status(200).json({
                success: true,
                message: "Teacher request approved successfully",
                data: { result }
            });
        }
        catch(error){
            next(error);
        }
    },
    async rejectTeacherRequest(req, res, next) {
        try{
            const { id } = req.params;
            const reviewerId = req.user.userId;
            const { message } = req.body;
            const result = await teacherRequestService.rejectTeacherRequest(id, reviewerId, { message });
            res.status(200).json({
                success: true,
                message: "Teacher request rejected successfully",
                data: { result }
            });
        }
        catch(error){
            next(error);
        }
    }
};

export default teacherRequestController;