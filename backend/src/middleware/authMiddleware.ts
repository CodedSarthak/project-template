import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {

    let token = req.cookies?.accessToken;

    if (!token) {
        const authHeader = req.headers['authorization'];
        token = authHeader && authHeader.split(' ')[1];
    }

    if (!token) {
        res.status(401).json({ success: false, message: 'Access token missing' });
        return;
    }

    const decoded = verifyAccessToken(token);

    if (!decoded) {
        res.status(401).json({ success: false, message: 'Invalid or expired access token' });
        return;
    }

    req.user = {
        id: decoded.userId
    };

    next();
};