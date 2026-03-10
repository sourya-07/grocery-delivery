import { Router } from "express";
import { getCart, updateCart, clearCart } from "../controllers/cartController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.get("/get", authMiddleware, getCart);
router.post("/update", authMiddleware, updateCart);
router.delete("/clear", authMiddleware, clearCart);

export default router;
