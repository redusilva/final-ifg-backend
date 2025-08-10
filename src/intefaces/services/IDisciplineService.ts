import { SessionType } from "../config/IntDatabase";
import { IDiscipline, IDisciplineCreate, IDisciplineReport, Schedule } from "../entities/Discipline";
import { IUser } from "../entities/User";
import { BasicServiceResponse } from "../types";

export interface IDisciplineService {
    create(data: IDisciplineCreate): Promise<IDiscipline>;
    findById(id: string, session: SessionType): Promise<IDiscipline | null>;
    findByDayOfWeek(day: number, session: SessionType): Promise<BasicServiceResponse>;
    subscribeStudentToDiscipline(disciplineId: string, data: IUser, session: SessionType): Promise<BasicServiceResponse>;
    unsubscribeStudentFromDiscipline(disciplineId: string, user: IUser, session: SessionType): Promise<BasicServiceResponse>;
    subscribeTeacherToDiscipline(disciplineId: string, user: IUser, session: SessionType): Promise<BasicServiceResponse>;
    unsubscribeTeacherFromDiscipline(disciplineId: string, user: IUser, session: SessionType): Promise<BasicServiceResponse>;
    getAll(session?: SessionType): Promise<IDisciplineReport[]>;
    deleteById(id: string, session: SessionType): Promise<void>;
    createSchedule(id: string, data: Schedule, session: SessionType): Promise<BasicServiceResponse>;
    deleteSchedule(id: string, session: SessionType): Promise<BasicServiceResponse>;
    registerClassroom(classroomId: string, disciplineId: string, session: SessionType): Promise<BasicServiceResponse>;
    removeClassroom(classroomId: string, disciplineId: string, session: SessionType): Promise<BasicServiceResponse>;
}