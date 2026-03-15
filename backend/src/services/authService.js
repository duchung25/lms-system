import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

const authService = {
    async register(userData) {
        const { username, email, password } = userData;
        if(!username || !email || !password) {
            throw new Error("All fields are required");
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("Email already in use");
        }
        if(password.length < 6) {
            throw new Error("Password must be at least 6 characters");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });   
        return {
            message: "Created user successfully",
            user
        };
    },
    async login(userData){
        const { email, password } = userData;
        if(!email || !password) {
            throw new Error("All fields are required");
        }
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("User not found");
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            throw new Error("Invalid credentials");
        }
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        const { password: _, ...userWithoutPassword } = user.toObject();
        return {
            message: "Login successful",
            token,
            user: userWithoutPassword
        };
    }
};

export default authService;