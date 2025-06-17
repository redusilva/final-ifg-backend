import { SessionType } from "../config/IntDatabase";
import { IntBasicUser, IUser } from "../entities/User";

export interface IntUserService {
    findUserByEmail(email: string, session: SessionType): Promise<IUser | null>;
    createUser(user: IntBasicUser, session: SessionType): Promise<IUser | null>;
}