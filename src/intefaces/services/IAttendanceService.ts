import { SessionType } from "../config/IntDatabase";
import { BasicServiceResponse } from "../types";

export interface IAttendanceService {
    checkPresence(studentId: string, disciplineId: string, isPresent: boolean, startTime: string, classDate: Date, session: SessionType): Promise<BasicServiceResponse>;
    processDailyAbsences(session: SessionType): Promise<void>;
}