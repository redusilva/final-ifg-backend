import { ClientSession } from 'mongoose';
import { IAuthRepository } from '../intefaces/repositories/IAuthRepository';
import { IUser } from '../intefaces/entities/User';
import { UserModel } from '../models/UserMongooseModel';
import { CreateUserValidatorType } from '../validators/UserValidator';

class AuthMongooseRepository implements IAuthRepository {
    constructor() {

    }
    async getUserByEmail(email: string, session: ClientSession): Promise<IUser | null> {
        const result = await UserModel.findOne({ email }).session(session);
        if (!result) return null;

        return {
            id: result._id.toString(),
            name: result.name,
            email: result.email,
            password: result.password,
            created_at: result.created_at,
            updated_at: result.updated_at
        }
    }

    async createUser(user: CreateUserValidatorType, session: ClientSession): Promise<IUser | null> {
        const newUser = new UserModel({
            name: user.name,
            email: user.email,
            password: user.password
        });

        const result = await newUser.save({ session });
        if (!result) return null;

        return {
            id: result._id.toString(),
            name: result.name,
            email: result.email,
            password: result.password,
            created_at: result.created_at,
            updated_at: result.updated_at
        };
    }

    async getUserById(id: string): Promise<IUser | null> {
        const result = await UserModel.findById(id);
        if (!result) return null;

        return {
            id: result._id.toString(),
            name: result.name,
            email: result.email,
            password: result.password,
            created_at: result.created_at,
            updated_at: result.updated_at
        }
    }

    async deleteUserById(id: string): Promise<void> {
        await UserModel.findByIdAndDelete(id);
    }
}

export default AuthMongooseRepository;