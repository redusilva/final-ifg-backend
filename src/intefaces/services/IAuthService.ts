import { CreateUserValidatorType } from "../../validators/UserValidator";
import { IUser } from "../entities/User";

export interface IAuthService {
    getUserByEmail(email: string, session: any): Promise<IUser | null>;

    createUser(user: CreateUserValidatorType, session: any): Promise<{ status: number; data: IUser | null; message: string }>;

    getUserById(id: string): Promise<IUser | null>;
}