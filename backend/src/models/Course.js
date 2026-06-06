import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true,
        },
        thumbnail: {
            type: String,
            default: ""
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        level: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
            required: true
        },
        isPublished: {
            type: Boolean,
            default: false
        },
        category: {
            type: String,
            enum: ["Programming", "Design", "Marketing", "Business", "Other"],
            required: true
        },
        price: {
            type: Number,
            default: 0
        },
        slug: {
            type: String,
            unique: true,
            index: true,
            sparse: true
        },
        totalLessons:   { type: Number, default: 0 },
        totalDuration:  { type: Number, default: 0 },
        studentsCount:  { type: Number, default: 0 },
        averageRating: { type: Number, default: 0 },
        ratingCount: { type: Number, default: 0 },
    },
    {
        timestamps: true
    },
);
courseSchema.plugin(mongooseDelete, { 
    deletedAt: true, 
    overrideMethods: "all"
});
courseSchema.index({ teacherId: 1 });
courseSchema.index({ isPublished: 1 });
courseSchema.index({ createdAt: -1 });

const Course = mongoose.model("Course", courseSchema);

export default Course;