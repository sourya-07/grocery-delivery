import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import AddressModel from "../models/Address.model";

// POST /api/address/add
export const addAddress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, email, street, city, state, zipcode, country, phone } = req.body;
        const required = ["firstName", "lastName", "email", "street", "city", "state", "zipcode", "country", "phone"];
        const missing = required.filter((f) => !req.body[f]);
        if (missing.length > 0) {
            res.status(400).json({ success: false, message: `Missing fields: ${missing.join(", ")}` });
            return;
        }
        const address = await AddressModel.create({
            userId: req.userId,
            firstName, lastName, email,
            street, city, state, zipcode, country, phone,
        });
        res.status(201).json({ success: true, message: "Address saved", address });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/address/get — all addresses for the logged-in user
export const getAddresses = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const addresses = await AddressModel.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json({ success: true, addresses });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// DELETE /api/address/remove
export const removeAddress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.body;
        if (!id) {
            res.status(400).json({ success: false, message: "Address id is required" });
            return;
        }
        const address = await AddressModel.findOneAndDelete({ _id: id, userId: req.userId });
        if (!address) {
            res.status(404).json({ success: false, message: "Address not found" });
            return;
        }
        res.json({ success: true, message: "Address removed" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
