import { Router } from "express";
import { registerUser, loginUser } from "../controllers/userController";

const router = Router();

// POST /api/user/register
router.post("/register", registerUser);

// POST /api/user/login
router.post("/login", loginUser);

export default router;
