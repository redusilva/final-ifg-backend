import { SessionType } from "../config/IntDatabase";
import { IDisciplineCreate, IDiscipline, IDisciplineReport, Schedule } from "../entities/Discipline";

export interface IDisciplineRepository {
    create(data: IDisciplineCreate): Promise<IDiscipline>;
    findById(id: string): Promise<IDiscipline | null>;
    subscribeStudentToDiscipline(disciplineId: string, userId: string, session: SessionType): Promise<IDiscipline>;
    unsubscribeStudentFromDiscipline(disciplineId: string, userId: string, session: SessionType): Promise<IDiscipline>;
    subscribeTeacherToDiscipline(disciplineId: string, userId: string, session: SessionType): Promise<IDiscipline>;
    unsubscribeTeacherFromDiscipline(disciplineId: string, userId: string, session: SessionType): Promise<IDiscipline>;
    getAll(session?: SessionType): Promise<IDisciplineReport[]>;
    deleteById(id: string, session: SessionType): Promise<void>;
    createSchedule(id: string, data: Schedule, session: SessionType): Promise<Schedule>;
    deleteSchedule(id: string, session: SessionType): Promise<void>;
}