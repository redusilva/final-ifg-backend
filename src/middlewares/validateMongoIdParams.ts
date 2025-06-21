import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

export function validateMongoIdParams(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const invalidParams: { param: string; value: string }[] = [];

    for (const [key, value] of Object.entries(req.params)) {
        if (!Types.ObjectId.isValid(value)) {
            invalidParams.push({ param: key, value });
        }
    }

    if (invalidParams.length > 0) {
        res.status(400).json({
            message: 'Invalid MongoDB ID in params',
            errors: invalidParams
        });
        return;
    }

    next();
}
