import { IUser } from "./User";

export interface Schedule {
    day_of_week: Number; // 0 = Domingo, 1 = Segunda, ... 6 = Sábado
    start_time: String; // formato 'HH:mm'
    end_time: String;    // formato 'HH:mm'
};

export interface IDiscipline {
    id: string;
    name: string;
    description: string;
    classroom_id: string | null;
    teacher_id: string | null;
    students: string[];
    schedule: Schedule | null;
    created_at: Date;
    updated_at: Date;
}

export interface IDisciplineCreate {
    name: string;
    description: string;
    classroom_id: string | null;
    teacher_id: string | null;
    students: string[];
    schedule: Schedule | null;
}

export interface IDisciplineReport {
    id: string;
    name: string;
    description: string;
    classroom: string | null;
    teacher: IUser | null;
    students: IUser[];
    schedule: Schedule | null;
    created_at: Date;
    updated_at: Date;
}