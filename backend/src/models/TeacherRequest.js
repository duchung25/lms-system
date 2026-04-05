import mongoose from 'mongoose';

const teacherRequestSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending"
        },
        message: {
            type: String,
            default: ""
        },
        adminMessage: {
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