import { Router } from "express";
import {
    listProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    upload,
} from "../controllers/productController";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Public
router.get("/list", listProducts);
router.get("/:id", getProductById);

// Admin only
router.post("/add", authMiddleware, adminMiddleware, upload.array("images", 5), addProduct);
router.put("/update", authMiddleware, adminMiddleware, upload.array("images", 5), updateProduct);
router.delete("/remove", authMiddleware, adminMiddleware, deleteProduct);

export default router;
