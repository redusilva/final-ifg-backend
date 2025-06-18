import { SessionType } from "../config/IntDatabase";
import { IntBasicUser, IUser, UserType } from "../entities/User";

export interface IntUserService {
    findUserByEmail(email: string, session: SessionType): Promise<IUser | null>;
    createUser(user: IntBasicUser, session: SessionType): Promise<IUser | null>;
    findUserById(id: string, session: SessionType): Promise<IUser | null>;
    deleteUserById(id: string, session: SessionType): Promise<void>;
    findAllUsers(session: SessionType): Promise<IUser[]>;
    findAllUsersByType(type: UserType, session: SessionType): Promise<IUser[]>
}