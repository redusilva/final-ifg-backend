import { IUser } from "../intefaces/entities/User";

export const buildUser = (user: any): IUser => ({
    id: user?.id,
    name: user?.name,
    email: user?.email,
    phone: user?.phone,
    type: user?.type,
    created_at: user?.created_at,
    updated_at: user?.updated_at
})