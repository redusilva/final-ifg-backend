import { SessionType } from "../config/IntDatabase";
import { IClassroom, IClassroomCreate } from "../entities/Classroom";
import { BasicServiceResponse } from "../types";

export interface IClassroomService {
    create: (data: IClassroomCreate, session: SessionType) => Promise<BasicServiceResponse>;
    getAll(session?: SessionType): Promise<IClassroom[]>;
    findById(id: string, session?: SessionType): Promise<IClassroom | null>;
    deleteById(id: string, session: SessionType): Promise<BasicServiceResponse>;
}