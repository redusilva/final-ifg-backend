import { SessionType } from "../intefaces/config/IntDatabase";
import { IClassroomCreate, IClassroom } from "../intefaces/entities/Classroom";
import { IDisciplineRepository } from "../intefaces/repositories/IDisciplineRepository";
import { IClassroomRepository } from "../intefaces/repositories/IClassroomRepository";
import { IClassroomService } from "../intefaces/services/IClassroomService";
import { BasicServiceResponse } from "../intefaces/types";
import { buildServiceResponse } from "../utils/builder";

interface Props {
    classroomRepository: IClassroomRepository;
    disciplineRepository: IDisciplineRepository;
}

class ClassroomService implements IClassroomService {
    private classroomRepository: IClassroomRepository;
    private disciplineRepository: IDisciplineRepository;

    constructor(data: Props) {
        this.classroomRepository = data.classroomRepository;
        this.disciplineRepository = data.disciplineRepository;
    }

    async create(data: IClassroomCreate, session: SessionType): Promise<BasicServiceResponse> {
        const currentClassroom = await this.classroomRepository.findClassroomByData(data, session);
        if (currentClassroom) {
            return buildServiceResponse(400, "Classroom already exists", null);
        }

        const classroom = await this.classroomRepository.create(data, session);
        if (!classroom) {
            return buildServiceResponse(400, "Classroom not created", null);
        }

        return buildServiceResponse(201, null, classroom);
    }

    async getAll(session?: SessionType): Promise<IClassroom[]> {
        const classrooms = await this.classroomRepository.getAll(session);
        return classrooms || [];
    }

    async findById(id: string, session?: SessionType): Promise<IClassroom | null> {
        const classroom = await this.classroomRepository.findById(id, session);
        return classroom;
    }

    async deleteById(id: string, session: SessionType): Promise<BasicServiceResponse> {
        const classroom = await this.classroomRepository.findById(id, session);
        if (!classroom) {
            return buildServiceResponse(404, "Classroom not found", null);
        }

        await Promise.all([
            this.disciplineRepository.removeClassroomFromAllDisciplines(id, session),
            this.classroomRepository.deleteById(id, session)
        ])

        return buildServiceResponse(
            200,
            "Operação realizada com sucesso!",
            null
        );
    }
}

export default ClassroomService;