import { IUser } from "./User";

export interface Schedule {
    day_of_week: Number;
    start_time: String;
    end_time: String;
};

export interface IDisciplineSummary {
    id: string;
    name: string;
    description: string;
    total_classes: number | null;
    start_time: string;
    end_time: string;
    classroom_name: string | null;
    teacher_name: string | null;
}

export interface IDiscipline {
    id: string;
    name: string;
    description: string;
    total_classes: number | null;
    classroom_id: string | null;
    teacher_id: string | null;
    students: string[];
    schedule: Schedule[] | null;
    created_at: Date;
    updated_at: Date;
}

export interface IDisciplineReport {
    id: string;
    name: string;
    description: string;
    total_classes: number | null;
    classroom: string | null;
    teacher: IUser | null;
    students: IUser[];
    schedule: Schedule | null;
    created_at: Date;
    updated_at: Date;
}

export interface IDisciplineCreate {
    name: string;
    description: string;
    total_classes: number;
    classroom_id: string | null;
    teacher_id: string | null;
    students: string[];
    schedule: Schedule | null;
}