import { Request, Response, NextFunction } from "express";

// 404 Not Found
export const notFoundMiddleware = (req: Request, res: Response, _next: NextFunction): void => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
};

// Global Error Handler
export const errorMiddleware = (err: any, _req: Request, res: Response, _next: NextFunction): void => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};
