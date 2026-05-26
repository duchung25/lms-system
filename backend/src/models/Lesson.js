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
        default: ""
    },
    videoUrl: {
        type: String,
        default: null
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
        default: 0,
        min: 0
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

lessonSchema.index({ courseId: 1, order: 1, isPublished: 1 }, { unique: true });
lessonSchema.index({ courseId: 1, isPublished: 1 });

export default mongoose.model("Lesson", lessonSchema);