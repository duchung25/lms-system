import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

const lessonSchema = new mongoose.Schema({
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
        index:true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
    },
    videoUrl: {
        type: String,
    },
    order: {
        type: Number,
        required: true
    },
    isPublished: {
        type: Boolean,
        default: false  
    },
    duration: {
        type: Number, 
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, 
    { timestamps: true }
)
lessonSchema.plugin(mongooseDelete, { 
    deletedAt: true, 
    overrideMethods: "all"
});

lessonSchema.index({ courseId: 1, order: 1 }, { unique: true });

export default mongoose.model("Lesson", lessonSchema);