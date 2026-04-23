import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import connectDB from "./config/db";

import userRoutes    from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes   from "./routes/orderRoutes";
import cartRoutes    from "./routes/cartRoutes";
import addressRoutes from "./routes/addressRoutes";
import { notFoundMiddleware, errorMiddleware } from "./middleware/errorMiddleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

//  Middleware 
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//  Database 
connectDB();

//  API Routes 
app.use("/api/user",    userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/order",   orderRoutes);
app.use("/api/cart",    cartRoutes);
app.use("/api/address", addressRoutes);

// Health check
app.get("/api/health", (_req, res) => {
    res.json({ success: true, message: "Grocery Delivery API is running" });
});

//  Error Handling 
app.use(notFoundMiddleware);
app.use(errorMiddleware);

// In Vercel serverless, VERCEL=1 is injected automatically — skip listen().
// In Docker / local dev, VERCEL is never set, so always start the HTTP server.
if (!process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

export default app;
