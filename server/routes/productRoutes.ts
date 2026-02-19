import { Router } from "express";
import { listProducts, addProduct, updateProduct, deleteProduct, upload } from "../controllers/productController";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Public — list all products
router.get("/list", listProducts);

// Admin-only
router.post("/add", authMiddleware, adminMiddleware, upload.array("images", 5), addProduct);
router.put("/update", authMiddleware, adminMiddleware, upload.array("images", 5), updateProduct);
router.delete("/remove", authMiddleware, adminMiddleware, deleteProduct);

export default router;
