import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import ProductModel from "../models/Product.model";

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, "uploads/"),
    filename: (_req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, unique + path.extname(file.originalname));
    },
});
export const upload = multer({ storage });

export const addProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, category, price, offerPrice, description, inStock } = req.body;
        const files = req.files as Express.Multer.File[];
        const images = files ? files.map((f) => `/uploads/${f.filename}`) : [];
        const descArr = typeof description === "string" ? description.split("\n").filter(Boolean) : description || [];
        const product = await ProductModel.create({
            name,
            category,
            price: Number(price),
            offerPrice: offerPrice ? Number(offerPrice) : 0,
            image: images,
            description: descArr,
            inStock: inStock !== "false",
        });
        res.status(201).json({ success: true, message: "Product added", product });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const listProducts = async (_req: Request, res: Response): Promise<void> => {
    try {
        const products = await ProductModel.find().sort({ createdAt: -1 });
        res.json({ success: true, products });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, name, category, price, offerPrice, description, inStock } = req.body;
        const files = req.files as Express.Multer.File[];
        const updateData: any = { name, category, price: Number(price), inStock: inStock !== "false" };
        if (offerPrice !== undefined) updateData.offerPrice = Number(offerPrice);
        if (description) {
            updateData.description = typeof description === "string" ? description.split("\n").filter(Boolean) : description;
        }
        if (files && files.length > 0) {
            updateData.image = files.map((f) => `/uploads/${f.filename}`);
        }
        const product = await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
        if (!product) {
            res.status(404).json({ success: false, message: "Product not found" });
            return;
        }
        res.json({ success: true, message: "Product updated", product });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.body;
        const product = await ProductModel.findByIdAndDelete(id);
        if (!product) {
            res.status(404).json({ success: false, message: "Product not found" });
            return;
        }
        res.json({ success: true, message: "Product removed" });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
