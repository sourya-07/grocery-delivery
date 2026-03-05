import { Response, NextFunction } from "express";
import { AuthRequest } from "./authMiddleware";

// Validates that required fields are present in request body
export const validateBody = (fields: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        const missing = fields.filter((f) => !req.body[f] && req.body[f] !== 0);
        if (missing.length > 0) {
            res.status(400).json({
                success: false,
                message: `Missing required fields: ${missing.join(", ")}`,
            });
            return;
        }
        next();
    };
};
