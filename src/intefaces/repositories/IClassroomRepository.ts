import { SessionType } from "../config/IntDatabase";
import { IClassroomCreate, IClassroom } from "../entities/Classroom";

export interface IClassroomRepository {
    findClassroomByData: (data: IClassroomCreate, session: SessionType) => Promise<IClassroom | null>;
    create: (data: IClassroomCreate, session: SessionType) => Promise<IClassroom>;
    getAll: (session?: SessionType) => Promise<IClassroom[]>;
    findById: (id: string, session?: SessionType) => Promise<IClassroom | null>;
    deleteById: (id: string, session: SessionType) => Promise<void>;
}