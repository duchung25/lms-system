import mongoose from "mongoose";

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
        password: {
            type: String,
            required: true,
            minLength: 6,
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
const User = mongoose.model("User", userSchema);
export default User;