import { SessionType } from "../config/IntDatabase";
import { IAttendance } from "../entities/Attendance";

export interface IAttendanceRepository {
    findOne(conditions: any, session: SessionType): Promise<IAttendance | null>;
    create(data: Partial<IAttendance>, session: SessionType): Promise<IAttendance>;
    incrementCheck(attendanceId: string, session: SessionType): Promise<IAttendance | null>;
    updateMany(conditions: any, update: any, session: SessionType): Promise<{ modifiedCount: number }>;
    find(conditions: any, projection?: any, session?: SessionType): Promise<IAttendance[]>;
    insertMany(docs: any[], session: SessionType): Promise<IAttendance[]>;
}