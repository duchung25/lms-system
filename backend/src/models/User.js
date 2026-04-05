import mongoose from "mongoose";
import mongooseDelete from "mongoose-delete";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        avatar: {
            type: String,
            default: ""
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
            select: false,
        },
        active: {
            type: Boolean,
            default: true,
        },
        role: {
            type: String,
            enum: ["student", "teacher", "admin"],
            default: "student",
        }
    },
    {
        timestamps: true,
    }
);
userSchema.plugin(mongooseDelete, { 
    deletedAt: true, 
    overrideMethods: "all"
});

const User = mongoose.model("User", userSchema);
export default User;