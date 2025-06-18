export type UserType = 'student' | 'teacher';

export interface IUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    type: UserType;
    created_at: Date;
    updated_at: Date;
}

export interface IntBasicUser {
    name: string;
    email: string;
    type: UserType;
    phone: string;
}