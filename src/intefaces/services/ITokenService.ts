export interface ITokenService {
    generateToken(payload: Record<string, unknown>, expiresIn?: number): string;

    verifyToken<T = any>(token: string): T | null;
}
