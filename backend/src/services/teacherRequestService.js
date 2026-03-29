import TeacherRequest from "../models/TeacherRequest.js";
import User from "../models/User.js";

const teacherRequestService = {
    async createTeacherRequest(userId, message = "") {
        try{
            const user = await User.findById(userId);
            if(!user){
                throw new Error("User not found");
            }
            if(user.role === "teacher" || user.role === "admin"){
                throw new Error("You are already a teacher or admin");
            }
            const existingRequest = await TeacherRequest.findOne({userId, status: "Pending"});
            if(existingRequest){
                throw new Error("You already have a pending teacher request");
            }
            const teacherRequest = await TeacherRequest.create({userId, message});
            return await teacherRequest.populate("userId", "username email");
        }
        catch(error){
            throw new Error("Failed to create teacher request: " + error.message);
        }
    },
    async getMyRequest(userId) {
        try{
            const teacherRequest = await TeacherRequest.findOne({userId}).sort({createdAt: -1}).populate("userId", "username email");
            if(!teacherRequest){
                throw new Error("No teacher request found for this user");
            }
            return teacherRequest;
        }
        catch(error){
            throw new Error("Failed to get teacher request: " + error.message);
        }
    },
    async getAllTeacherRequests({status} = {}) {
        try{
            const filter = {};
            if(status){
                filter.status = status;
            }
            const teacherRequests = await TeacherRequest
            .find(filter).sort({createdAt: -1})
            .populate("userId", "username email")
            .populate("reviewerId", "username");
            if(teacherRequests.length === 0){
                throw new Error("No teacher requests found");
            }
            return teacherRequests;
        }
        catch(error){
            throw new Error("Failed to get teacher requests: " + error.message);
        }
    },
    async approveTeacherRequest(requestId, reviewerId) {
        try{
            const request = await TeacherRequest.findById(requestId);
            if(!request){
                throw new Error("Teacher request not found");
            }
            if(request.status !== "Pending"){
                throw new Error("Only pending requests can be approved");
            }
            const user = await User.findById(request.userId);
            if(!user){
                throw new Error("User not found");
            }
            user.role = "teacher";
            await user.save();

            request.status = "Approved";
            request.reviewerId = reviewerId;
            await request.save();
            return {request, user};
        }
        catch(error){
            throw new Error("Failed to approve teacher request: " + error.message);
        }
    },
    async rejectTeacherRequest(requestId, reviewerId, {message = ""} = {}) {
        try{
            const request = await TeacherRequest.findById(requestId);
            if(!request){
                throw new Error("Teacher request not found");
            }
            if(request.status !== "Pending"){
                throw new Error("Only pending requests can be rejected");
            }
            request.status = "Rejected";
            request.reviewerId = reviewerId;
            if(message){
                request.message = message;
            }
            await request.save();
            return request;
        }        
        catch(error){
            throw new Error("Failed to reject teacher request: " + error.message);
        }
    }
};

export default teacherRequestService;