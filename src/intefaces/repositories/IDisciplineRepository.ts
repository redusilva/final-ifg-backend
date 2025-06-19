import { SessionType } from "../config/IntDatabase";
import { IDisciplineCreate, IDiscipline } from "../entities/Discipline";

export interface IDisciplineRepository {
    create(data: IDisciplineCreate): Promise<IDiscipline>;
    findById(id: string): Promise<IDiscipline | null>;
    subscribeStudentToDiscipline(disciplineId: string, userId: string, session: SessionType): Promise<IDiscipline>;
    unsubscribeStudentFromDiscipline(disciplineId: string, userId: string, session: SessionType): Promise<IDiscipline>;
    subscribeTeacherToDiscipline(disciplineId: string, userId: string, session: SessionType): Promise<IDiscipline>;
    unsubscribeTeacherFromDiscipline(disciplineId: string, userId: string, session: SessionType): Promise<IDiscipline>;
}