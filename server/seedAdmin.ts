import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import UserModel from "./models/User.model";

dotenv.config({ path: path.join(__dirname, "./.env") });

const seedAdmin = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) throw new Error("MONGODB_URI not found in .env");

        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB...");

        const adminEmail = "admin@grocery.com";
        const existingAdmin = await UserModel.findOne({ email: adminEmail });

        if (existingAdmin) {
            console.log("Admin user already exists.");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash("Admin@123", 10);
        await UserModel.create({
            name: "Admin User",
            email: adminEmail,
            password: hashedPassword,
            role: "admin",
        });

        console.log("Admin user created successfully!");
        console.log("Email: admin@grocery.com");
        console.log("Password: Admin@123");
        
        process.exit(0);
    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();
