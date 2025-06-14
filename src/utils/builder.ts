import { IUser, IUserPublic } from "../intefaces/entities/User";

export const buildPublicUserData = (user: IUser): IUserPublic => {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at
    };
}