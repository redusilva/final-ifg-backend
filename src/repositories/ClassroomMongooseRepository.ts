import { SessionType } from "../intefaces/config/IntDatabase";
import { IClassroom, IClassroomCreate } from "../intefaces/entities/Classroom";
import { IClassroomRepository } from "../intefaces/repositories/IClassroomRepository";
import { ClassroomModel } from "../models/ClassroomMongooseModel";
import { buildClassroom } from "../utils/builder";

class ClassroomMongooseRepository implements IClassroomRepository {
    async findClassroomByData(data: IClassroomCreate, session: SessionType): Promise<IClassroom | null> {
        const classroom = await ClassroomModel.findOne(data).session(session);
        return classroom ? buildClassroom(classroom) : null;
    }

    async create(data: IClassroomCreate, session: SessionType): Promise<IClassroom> {
        const classroom = new ClassroomModel(data);
        await classroom.save({ session });

        return buildClassroom(classroom);
    }

    async getAll(session: SessionType): Promise<IClassroom[]> {
        const classrooms = await ClassroomModel.find().session(session) || [];
        return classrooms.map(buildClassroom);
    }

    async findById(id: string, session: SessionType): Promise<IClassroom | null> {
        const classroom = await ClassroomModel.findById(id).session(session);
        return classroom ? buildClassroom(classroom) : null;
    }

    async deleteById(id: string, session: SessionType): Promise<void> {
        await ClassroomModel.findByIdAndDelete(id).session(session);
    }
}

export default ClassroomMongooseRepository;