import { Router } from "express";
import { registerUser, loginUser, getUserProfile, getAllUsers } from "../controllers/userController";
import { authMiddleware, adminMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", authMiddleware, getUserProfile);
router.get("/all", authMiddleware, adminMiddleware, getAllUsers);

export default router;
