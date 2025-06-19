import { IUser } from "./User";

export interface IDiscipline {
    id: string;
    name: string;
    description: string;
    teacher_id: string;
    students: string[];
    schedule: [
        {
            day_of_week: Number; // 0 = Domingo, 1 = Segunda, ... 6 = Sábado
            start_time: String; // formato 'HH:mm'
            end_time: String;    // formato 'HH:mm'
        }
    ];
    created_at: Date;
    updated_at: Date;
}

export interface IDisciplineCreate {
    name: string;
    description: string;
    teacher_id: string;
    students: string[];
    schedule: [
        {
            day_of_week: Number; // 0 = Domingo, 1 = Segunda, ... 6 = Sábado
            start_time: String; // formato 'HH:mm'
            end_time: String;    // formato 'HH:mm'
        }
    ];
}

export interface IDisciplineReport {
    id: string;
    name: string;
    description: string;
    teacher: IUser | null;
    students: IUser[];
    schedule: [
        {
            day_of_week: Number; // 0 = Domingo, 1 = Segunda, ... 6 = Sábado
            start_time: String; // formato 'HH:mm'
            end_time: String;    // formato 'HH:mm'
        }
    ];
    created_at: Date;
    updated_at: Date;
}