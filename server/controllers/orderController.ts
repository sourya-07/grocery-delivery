import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import OrderModel from "../models/Order.model";

// POST /api/order/place
export const placeOrder = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { items, address, amount, paymentMethod } = req.body;
        if (!items || !address || !amount) {
            res.status(400).json({ success: false, message: "items, address, and amount are required" });
            return;
        }
        const order = await OrderModel.create({
            userId: req.userId,
            items,
            address,
            amount,
            paymentMethod: paymentMethod || "COD",
        });
        res.status(201).json({ success: true, message: "Order placed", order });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/order/user — customer's own orders
export const getUserOrders = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const orders = await OrderModel.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/order/all — admin: all orders
export const getAllOrders = async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const orders = await OrderModel.find().populate("userId", "name email").sort({ createdAt: -1 });
        res.json({ success: true, orders });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/order/status — admin: update status
export const updateOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { orderId, status } = req.body;
        if (!orderId || !status) {
            res.status(400).json({ success: false, message: "orderId and status are required" });
            return;
        }
        const order = await OrderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) {
            res.status(404).json({ success: false, message: "Order not found" });
            return;
        }
        res.json({ success: true, message: "Order status updated", order });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
