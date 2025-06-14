import { CreateUserValidatorType } from "../../validators/UserValidator";
import { IUser } from "../entities/User";

export type SessionType = any;

export interface IAuthService {
    getUserByEmail(email: string, session: SessionType): Promise<IUser | null>;

    createUser(user: CreateUserValidatorType, session: SessionType): Promise<{ status: number; data: IUser | null; message: string }>;

    getUserById(id: string): Promise<IUser | null>;

    deleteUserById(id: string): Promise<void>;
}