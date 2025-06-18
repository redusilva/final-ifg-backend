export interface IUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    type: 'student' | 'teacher';
    created_at: Date;
    updated_at: Date;
}

export interface IntBasicUser {
    name: string;
    email: string;
    type: 'student' | 'teacher';
    phone: string;
}