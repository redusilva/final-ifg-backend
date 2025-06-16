export interface IUser {
    id: string;
    name: string;
    email: string;
    type: string;
    created_at?: Date;
    updated_at?: Date;
}