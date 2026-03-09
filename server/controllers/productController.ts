import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import ProductModel from "../models/Product.model";
import { AuthRequest } from "../middleware/authMiddleware";

// Multer disk storage setup
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, "uploads/"),
    filename: (_req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, unique + path.extname(file.originalname));
    },
});
export const upload = multer({ storage });

// POST /api/product/add — admin only
export const addProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, category, price, offerPrice, description, inStock } = req.body;
        if (!name || !category || !price) {
            res.status(400).json({ success: false, message: "name, category and price are required" });
            return;
        }
        const files = req.files as Express.Multer.File[];
        const images = files ? files.map((f) => `/uploads/${f.filename}`) : [];
        const descArr =
            typeof description === "string" ? description.split("\n").filter(Boolean) : description || [];
        const product = await ProductModel.create({
            name,
            category,
            price: Number(price),
            offerPrice: offerPrice ? Number(offerPrice) : 0,
            image: images,
            description: descArr,
            inStock: inStock !== "false" && inStock !== false,
        });
        res.status(201).json({ success: true, message: "Product added", product });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/product/list — public
export const listProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { category, search } = req.query;
        const filter: any = {};
        if (category && category !== "all") filter.category = category;
        if (search) filter.name = { $regex: search, $options: "i" };
        const products = await ProductModel.find(filter).sort({ createdAt: -1 });
        res.json({ success: true, products });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/product/:id — public
export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await ProductModel.findById(req.params.id);
        if (!product) {
            res.status(404).json({ success: false, message: "Product not found" });
            return;
        }
        res.json({ success: true, product });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// PUT /api/product/update — admin only
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, name, category, price, offerPrice, description, inStock } = req.body;
        if (!id) {
            res.status(400).json({ success: false, message: "Product id is required" });
            return;
        }
        const files = req.files as Express.Multer.File[];
        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (category !== undefined) updateData.category = category;
        if (price !== undefined) updateData.price = Number(price);
        if (offerPrice !== undefined) updateData.offerPrice = Number(offerPrice);
        if (inStock !== undefined) updateData.inStock = inStock !== "false" && inStock !== false;
        if (description !== undefined) {
            updateData.description =
                typeof description === "string" ? description.split("\n").filter(Boolean) : description;
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

// DELETE /api/product/remove — admin only
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.body;
        if (!id) {
            res.status(400).json({ success: false, message: "Product id is required" });
            return;
        }
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
