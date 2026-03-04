import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.model";
import { AuthRequest } from "../middleware/authMiddleware";

const generateToken = (id: string, role: string): string => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET as string, { expiresIn: "7d" });
};

// POST /api/user/register
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ success: false, message: "All fields are required" });
            return;
        }
        const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            res.status(409).json({ success: false, message: "Email already registered" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role: role === "admin" ? "admin" : "customer",
        });
        const token = generateToken(user._id.toString(), user.role);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/user/login
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ success: false, message: "Email and password are required" });
            return;
        }
        const user = await UserModel.findOne({ email: email.toLowerCase() });
        if (!user) {
            res.status(401).json({ success: false, message: "Invalid credentials" });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ success: false, message: "Invalid credentials" });
            return;
        }
        const token = generateToken(user._id.toString(), user.role);
        res.json({
            success: true,
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/user/profile
export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await UserModel.findById(req.userId).select("-password");
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        res.json({ success: true, user });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/user/all — admin only
export const getAllUsers = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const users = await UserModel.find().select("-password").sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
