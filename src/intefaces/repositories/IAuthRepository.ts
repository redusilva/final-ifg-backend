import { CreateUserValidatorType } from "../../validators/UserValidator";
import { IUser } from "../entities/User";

export interface IAuthRepository {
    getUserByEmail(email: string, session: any): Promise<IUser | null>;

    createUser(user: CreateUserValidatorType, session: any): Promise<IUser | null>;

    getUserById(id: string): Promise<IUser | null>;
}