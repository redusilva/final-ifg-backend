import jwt from 'jsonwebtoken';
import { ITokenService } from '../intefaces/services/ITokenService';

export class JwtTokenService implements ITokenService {
    private readonly secret: string;

    constructor(secret: string) {
        this.secret = secret;
    }

    generateToken(payload: Record<string, unknown>, expiresIn?: number): string {
        const options: jwt.SignOptions = expiresIn ? { expiresIn } : {};
        return jwt.sign(payload, this.secret, options);
    }

    verifyToken<T = any>(token: string): T | null {
        try {
            return jwt.verify(token, this.secret) as T;
        } catch (error) {
            return null;
        }
    }
}
