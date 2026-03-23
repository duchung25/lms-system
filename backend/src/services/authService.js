import User from "../models/User.js";
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken";

const authService = {
    async register(userData) {
        const { username, email, password, role } = userData;
        const hashedPassword = await bcryptjs.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role
        });   
        return {
            message: "Created user successfully",
            user
        };
    },
    async login(userData){
        const { email, password } = userData;
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if(!isMatch){
            throw new Error("Invalid credentials");
        }
        const token = jwt.sign(
            { userId: user._id,
                role: user.role
             },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        const { password: _, ...userWithoutPassword } = user.toObject();
        return {
            message: "Login successful",
            token,
            user: userWithoutPassword
        };
    },
    async getUserProfile(userId) {
        const user = await User.findById(userId).select("-password");
        if(!user){
            throw new Error("User not found");
        }
        return user;
    },
    async updateUserProfile(userId, updateData) {
        const user = await User.findByIdAndUpdate(
            userId, 
            updateData,
            { new: true, runValidators: true }
        ).select("-password");
        if(!user){
            throw new Error("User not found");
        }
        return user;
    },
    async changeUserPassword(userId, currentPassword, newPassword) {
        const user = await User.findById(userId);
        if(!user){
            throw new Error("User not found");
        }
        const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);
        if(!isPasswordValid){
            throw new Error("Current password is incorrect");
        }
        const hashedNewPassword = await bcryptjs.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();
        return user;
    }
};

export default authService;