import { Types } from 'mongoose';

export interface IAttendance {
    id: string;
    studentId: Types.ObjectId;
    disciplineId: Types.ObjectId;
    classDate: Date;
    start_time: string;
    status: 'PENDING' | 'PRESENT' | 'ABSENT';
    presenceChecks: number;
    checkTimestamps: Date[];
    created_at: Date;
    updated_at: Date;
}