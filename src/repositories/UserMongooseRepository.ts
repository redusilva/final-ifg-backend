import { SessionType } from "../intefaces/config/IntDatabase";
import { IntBasicUser, IUser } from "../intefaces/entities/User";
import { IntUserRepository } from "../intefaces/repositories/IntUserRepository";
import { UserModel } from "../models/UserMongooseModel";

class UserMongooseRepository implements IntUserRepository {
    async findUserByEmail(email: string, session: SessionType): Promise<IUser | null> {
        const user = await UserModel.findOne({ email }).session(session);
        if (!user) return null;

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            type: user.type,
            created_at: user.created_at,
            updated_at: user.updated_at
        };
    }

    async createUser(user: IntBasicUser, session: SessionType): Promise<IUser | null> {
        const createdUser = new UserModel(user);
        await createdUser.save({ session });

        return {
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
            phone: createdUser.phone,
            type: createdUser.type,
            created_at: createdUser.created_at,
            updated_at: createdUser.updated_at
        };
    }

    async findUserById(id: string, session: SessionType): Promise<IUser | null> {
        const user = await UserModel.findById(id).session(session);
        if (!user) return null;

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            type: user.type,
            created_at: user.created_at,
            updated_at: user.updated_at
        };
    }

    async deleteUserById(id: string, session: SessionType): Promise<void> {
        await UserModel.findByIdAndDelete(id).session(session);
    }
}

export default UserMongooseRepository;