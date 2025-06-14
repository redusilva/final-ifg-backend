import bcrypt from 'bcrypt';
import { IPasswordService } from '../intefaces/services/IPasswordService';

export class BcryptPasswordService implements IPasswordService {
    private readonly saltRounds: number;

    constructor(saltRounds: number) {
        this.saltRounds = saltRounds;
    }

    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}
