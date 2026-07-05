import TeacherRequest from "../models/TeacherRequest.js";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import notificationService from "./notificationService.js";

const teacherRequestService = {
    async createTeacherRequest(userId, message = "") {
        const user = await User.findById(userId);
        if(!user){
            throw new AppError("User not found", 404);
        }
        if(user.role === "teacher" || user.role === "admin"){
            throw new AppError("You are already a teacher or admin", 400);
        }
        const existingRequest = await TeacherRequest.findOne({userId, status: "Pending"});
        if(existingRequest){
            throw new AppError("You already have a pending teacher request", 400);
        }
        const teacherRequest = await TeacherRequest.create({userId, message});
        return await teacherRequest.populate("userId", "username email");
    },
    async getMyRequest(userId) {
        const teacherRequest = await TeacherRequest.findOne({userId}).sort({createdAt: -1}).populate("userId", "username email");
        return teacherRequest;
    },
    async getAllTeacherRequests({status} = {}) {
        const filter = {};
        if(status){
            filter.status = status;
        }
        const teacherRequests = await TeacherRequest
        .find(filter).sort({createdAt: -1})
        .populate("userId", "username email")
        .populate("reviewerId", "username");
        return teacherRequests;
    },
    async approveTeacherRequest(requestId, reviewerId) {
        const session = await User.startSession();
        session.startTransaction();
            try {
                const request = await TeacherRequest.findById(requestId).session(session);
                if(!request){
                    throw new AppError("Teacher request not found", 404);
                }
                const user = await User.findById(request.userId).session(session);
                if(request.status !== "Pending"){
                    throw new AppError("Only pending requests can be approved", 400);
                }
                if(!user){
                    throw new AppError("User not found", 404);
                }
                user.role = "teacher";
                await user.save({ session });

                request.status = "Approved";
                request.reviewerId = reviewerId;
                await request.save({ session });

                await session.commitTransaction();

               const updatedRequest = await TeacherRequest.findById(requestId)
                    .populate("reviewerId", "username");
                await notificationService.createNotification({
                    userId: updatedRequest.userId,
                    title: "Yêu cầu giảng viên đã được duyệt",
                    message: "Tài khoản của bạn đã được nâng cấp thành giảng viên.",
                    type: "TEACHER_REQUEST_APPROVED",
                    referenceId: updatedRequest._id,
                    referenceType: "TeacherRequest",
                    link: "/teacher/dashboard",
                });
                return updatedRequest;
            } catch (err) {
                await session.abortTransaction();
                throw err;
            } finally{
                session.endSession();
            }
    },
    async rejectTeacherRequest(requestId, reviewerId, {message = ""} = {}) {
        const request = await TeacherRequest.findById(requestId);
        if(!request){
            throw new AppError("Teacher request not found", 404);
        }
        if(request.status !== "Pending"){
            throw new AppError("Only pending requests can be rejected", 400);
        }
        request.status = "Rejected";
        request.reviewerId = reviewerId;
        if(message){
            request.adminMessage = message;
        }
        await request.save();
        await notificationService.createNotification({
            userId: request.userId,
            title: "Yêu cầu giảng viên bị từ chối",
            message: message || "Yêu cầu trở thành giảng viên của bạn chưa được chấp thuận.",
            type: "TEACHER_REQUEST_REJECTED",
            referenceId: request._id,
            referenceType: "TeacherRequest",
            link: "/my-profile",
        });
        return await request.populate("reviewerId", "username");
    }
};

export default teacherRequestService;
