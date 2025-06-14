import { ClientSession } from 'mongoose';
import { IAuthRepository } from '../intefaces/repositories/IAuthRepository';
import { IUser } from '../intefaces/entities/User';
import { IAuthService } from '../intefaces/services/IAuthService';
import { CreateUserValidatorType } from '../validators/UserValidator';

interface Data {
    authRepository: IAuthRepository;
}

class AuthService implements IAuthService {
    private authRepository: IAuthRepository;

    constructor({
        authRepository
    }: Data) {
        this.authRepository = authRepository;
    }

    async getUserByEmail(email: string, session: ClientSession): Promise<IUser | null> {
        const result = await this.authRepository.getUserByEmail(email, session);
        return result;
    }

    async createUser(user: CreateUserValidatorType, session: ClientSession): Promise<{ status: number; data: IUser | null; message: string }> {
        const createdUser = await this.getUserByEmail(user.email, session);
        if (createdUser) {
            return {
                status: 400,
                data: null,
                message: 'User already exists'
            };
        }

        const newUser = await this.authRepository.createUser(user, session);
        if (!newUser) {
            return {
                status: 500,
                data: null,
                message: 'Error creating user'
            };
        }

        return {
            status: 201,
            data: newUser,
            message: 'User created successfully'
        }
    }

    async getUserById(id: string): Promise<IUser | null> {
        const result = await this.authRepository.getUserById(id);
        return result;
    }

    async deleteUserById(id: string): Promise<void> {
        await this.authRepository.deleteUserById(id);
    }
}

export default AuthService;