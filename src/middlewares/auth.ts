import { Request, Response, NextFunction } from 'express';
import { validateToken } from '../utils/auth';
import { validateIP, validateTunnel } from '../utils/ip';

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

        const clientIp = req.ip as string;
        const ip =
            req.headers["x-forwarded-for"] ||
            req.socket.remoteAddress;
        const formattedIp = String(ip).replace("::ffff:", "");
        console.log("ip:", formattedIp);
        const cleanIp = clientIp.replace("::ffff:", "");

        console.log("IP detectado:", cleanIp);
        // const [isValidIp, isValidTunnel] = await Promise.all([
        //     validateIP(cleanIp),
        //     validateTunnel(cleanIp)
        // ])
        const isValidIp = await validateIP(cleanIp);
        console.log("isValidIp:", isValidIp);
        // console.log("isValidTunnel:", isValidTunnel);
        // if (!isValidIp || !isValidTunnel) {
        //     return res.status(401).json({ message: 'Unauthorized: Invalid IP' });
        // }
        if (!isValidIp) {
            return res.status(401).json({ message: 'Unauthorized: Invalid IP' });
        }

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

export default authMiddleware;