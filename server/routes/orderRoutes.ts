import { Router } from "express";
import { placeOrder, getUserOrders, getAllOrders, updateOrderStatus } from "../controllers/orderController";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";

const router = Router();

// Customer
router.post("/place", authMiddleware, placeOrder);
router.get("/user", authMiddleware, getUserOrders);

// Admin
router.get("/all", authMiddleware, adminMiddleware, getAllOrders);
router.put("/status", authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
