import { SessionType } from "../config/IntDatabase";
import { IDiscipline, IDisciplineCreate, IDisciplineReport } from "../entities/Discipline";
import { IUser } from "../entities/User";
import { BasicServiceResponse } from "../types";



export interface IDisciplineService {
    create(data: IDisciplineCreate): Promise<IDiscipline>;
    findById(id: string, session: SessionType): Promise<IDiscipline | null>;
    subscribeStudentToDiscipline(disciplineId: string, data: IUser, session: SessionType): Promise<BasicServiceResponse>;
    unsubscribeStudentFromDiscipline(disciplineId: string, user: IUser, session: SessionType): Promise<BasicServiceResponse>;
    subscribeTeacherToDiscipline(disciplineId: string, user: IUser, session: SessionType): Promise<BasicServiceResponse>;
    unsubscribeTeacherFromDiscipline(disciplineId: string, user: IUser, session: SessionType): Promise<BasicServiceResponse>;
    getAll(session?: SessionType): Promise<IDisciplineReport[]>;
    deleteById(id: string, session: SessionType): Promise<void>;
}