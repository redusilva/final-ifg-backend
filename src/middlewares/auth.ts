import { Request, Response, NextFunction } from 'express';
import { validateToken } from '../utils/auth';

const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        const isValid = await validateToken(token);
        if (!isValid) {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

export default authMiddleware;