import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/index.js";
import { ZodError } from "zod";

export function errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    if (err instanceof ZodError) {
        res.status(400).json({
            success: false,
            message: "Validation Error",
            errors: err.issues.map((e) => ({ path: e.path.join('.'), message: e.message }))
        });
        return;
    }

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
        return;
    }

    console.error(err);

    res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
}