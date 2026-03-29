import mongoose from 'mongoose';

const teacherRequestSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
        },
        message: {
            type: String,
            default: ""
        },
        reviewerId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    },
    {
        timestamps: true
    }
)

const TeacherRequest = mongoose.model("TeacherRequest", teacherRequestSchema);

export default TeacherRequest;