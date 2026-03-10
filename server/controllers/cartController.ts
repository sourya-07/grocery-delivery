import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import UserModel from "../models/User.model";

// GET /api/cart/get — get current user's cart
export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const user = await UserModel.findById(req.userId).select("cartData");
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        // Convert Map to plain object for JSON serialisation
        const cartData = Object.fromEntries(user.cartData);
        res.json({ success: true, cartData });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// POST /api/cart/update — add / update / remove item in cart
export const updateCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { productId, quantity } = req.body;
        if (!productId) {
            res.status(400).json({ success: false, message: "productId is required" });
            return;
        }
        const user = await UserModel.findById(req.userId);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        const qty = Number(quantity);
        if (qty <= 0) {
            user.cartData.delete(productId);
        } else {
            user.cartData.set(productId, qty);
        }
        await user.save();
        const cartData = Object.fromEntries(user.cartData);
        res.json({ success: true, message: "Cart updated", cartData });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/cart/clear — clear entire cart
export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await UserModel.findByIdAndUpdate(req.userId, { $set: { cartData: {} } });
        res.json({ success: true, message: "Cart cleared", cartData: {} });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
