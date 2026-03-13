import { Router } from "express";
import { addAddress, getAddresses, removeAddress } from "../controllers/addressController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/add", authMiddleware, addAddress);
router.get("/get", authMiddleware, getAddresses);
router.delete("/remove", authMiddleware, removeAddress);

export default router;
