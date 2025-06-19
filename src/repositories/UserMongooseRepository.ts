import { SessionType } from "../intefaces/config/IntDatabase";
import { IntBasicUser, IUser, UserType } from "../intefaces/entities/User";
import { IntUserRepository } from "../intefaces/repositories/IntUserRepository";
import { UserModel } from "../models/UserMongooseModel";
import { buildUser } from "../utils/builder";

class UserMongooseRepository implements IntUserRepository {
    async findUserByEmail(email: string, session: SessionType): Promise<IUser | null> {
        const user = await UserModel.findOne({ email }).session(session);
        if (!user) return null;

        return buildUser(user);
    }

    async createUser(user: IntBasicUser, session: SessionType): Promise<IUser | null> {
        const createdUser = new UserModel(user);
        await createdUser.save({ session });

        return buildUser(createdUser);
    }

    async findUserById(id: string, session: SessionType): Promise<IUser | null> {
        const user = await UserModel.findById(id).session(session);
        if (!user) return null;
        return buildUser(user);
    }

    async deleteUserById(id: string, session: SessionType): Promise<void> {
        await UserModel.findByIdAndDelete(id).session(session);
    }

    async findAllUsers(session: SessionType): Promise<IUser[]> {
        const users = await UserModel.find().session(session);
        if (!users) return [];

        return users.map(user => (buildUser(user)));
    }

    async findAllUsersByType(type: UserType, session: SessionType): Promise<IUser[]> {
        const users = await UserModel.find({ type }).session(session);
        if (!users) return [];

        return users.map(user => (buildUser(user)));
    }
}

export default UserMongooseRepository;