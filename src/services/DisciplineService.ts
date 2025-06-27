import { SessionType } from "../intefaces/config/IntDatabase";
import { IDiscipline, IDisciplineCreate, IDisciplineReport, Schedule } from "../intefaces/entities/Discipline";
import { IUser } from "../intefaces/entities/User";
import { IDisciplineRepository } from "../intefaces/repositories/IDisciplineRepository";
import { ILocationRepository } from "../intefaces/repositories/ILocationRepository";
import { IDisciplineService } from "../intefaces/services/IDisciplineService";
import { BasicServiceResponse } from "../intefaces/types";
import { buildServiceResponse } from "../utils/builder";

interface DataProps {
    disciplineRepository: IDisciplineRepository;
    classroomRepository: ILocationRepository;
}

class DisciplineService implements IDisciplineService {
    private disciplineRepository: IDisciplineRepository;
    private classroomRepository: ILocationRepository;

    constructor(data: DataProps) {
        this.disciplineRepository = data.disciplineRepository;
        this.classroomRepository = data.classroomRepository;
    }

    async create(data: IDisciplineCreate): Promise<IDiscipline> {
        const discipline = await this.disciplineRepository.create(data);
        return discipline;
    }

    async findById(id: string, session: SessionType): Promise<IDiscipline | null> {
        const discipline = await this.disciplineRepository.findById(id);
        return discipline;
    }

    async subscribeStudentToDiscipline(disciplineId: string, user: IUser, session: SessionType): Promise<BasicServiceResponse> {
        const discipline = await this.findById(disciplineId, session);
        if (!discipline) {
            return buildServiceResponse(404, 'Discipline not found', null);
        }

        if (user.type !== 'student') {
            return buildServiceResponse(400, 'User is not a student', null);
        }

        const alreadySubscribed = discipline.students.find((student) => student === user.id);
        if (alreadySubscribed) {
            return buildServiceResponse(400, 'User is already subscribed to this discipline', null);
        }

        const updatedDiscipline = await this.disciplineRepository.subscribeStudentToDiscipline(disciplineId, user.id, session);
        return buildServiceResponse(200, null, updatedDiscipline);
    }

    async unsubscribeStudentFromDiscipline(disciplineId: string, user: IUser, session: SessionType): Promise<BasicServiceResponse> {
        const discipline = await this.findById(disciplineId, session);
        if (!discipline) {
            return buildServiceResponse(404, 'Discipline not found', null);
        }

        if (user.type !== 'student') {
            return buildServiceResponse(400, 'User is not a student', null);
        }

        const alreadySubscribed = discipline.students.find((student) => student === user.id);
        if (!alreadySubscribed) {
            return buildServiceResponse(400, 'User is not subscribed to this discipline', null);
        }

        const updatedDiscipline = await this.disciplineRepository.unsubscribeStudentFromDiscipline(disciplineId, user.id, session);
        return buildServiceResponse(200, null, updatedDiscipline);
    }

    async subscribeTeacherToDiscipline(disciplineId: string, user: IUser, session: SessionType): Promise<BasicServiceResponse> {
        const discipline = await this.findById(disciplineId, session);
        if (!discipline) {
            return buildServiceResponse(404, 'Discipline not found', null);
        }

        if (user.type !== 'teacher') {
            return buildServiceResponse(400, 'User is not a teacher', null);
        }

        const alreadySubscribed = discipline.teacher_id === user.id;
        if (alreadySubscribed) {
            return buildServiceResponse(400, 'User is already subscribed to this discipline', null);
        }

        const updatedDiscipline = await this.disciplineRepository.subscribeTeacherToDiscipline(disciplineId, user.id, session);
        return buildServiceResponse(200, null, updatedDiscipline);
    }

    async unsubscribeTeacherFromDiscipline(disciplineId: string, user: IUser, session: SessionType): Promise<BasicServiceResponse> {
        const discipline = await this.findById(disciplineId, session);
        if (!discipline) {
            return buildServiceResponse(404, 'Discipline not found', null);
        }

        if (user.type !== 'teacher') {
            return buildServiceResponse(400, 'User is not a teacher', null);
        }

        const alreadySubscribed = discipline.teacher_id === user.id;
        if (!alreadySubscribed) {
            return buildServiceResponse(400, 'User is not subscribed to this discipline', null);
        }

        const updatedDiscipline = await this.disciplineRepository.unsubscribeTeacherFromDiscipline(disciplineId, user.id, session);
        return buildServiceResponse(200, null, updatedDiscipline);
    }

    async getAll(session?: SessionType): Promise<IDisciplineReport[]> {
        const disciplines = await this.disciplineRepository.getAll(session);
        return disciplines;
    }

    async deleteById(id: string, session: SessionType): Promise<void> {
        await this.disciplineRepository.deleteById(id, session);
    }

    async createSchedule(id: string, data: Schedule, session: SessionType): Promise<BasicServiceResponse> {
        const discipline = await this.disciplineRepository.findById(id);
        if (!discipline) {
            return buildServiceResponse(404, "Discipline not found", null);
        }

        if (discipline.schedule) {
            return buildServiceResponse(400, "Schedule already created", null);
        }

        const updatedDiscipline = await this.disciplineRepository.createSchedule(
            id,
            data,
            session
        )
        if (!updatedDiscipline) {
            throw new Error("Discipline not updated");
        }

        return buildServiceResponse(200, null, updatedDiscipline);
    }

    async deleteSchedule(id: string, session: SessionType): Promise<BasicServiceResponse> {
        const discipline = await this.findById(id, session);
        if (!discipline) {
            return buildServiceResponse(404, "Discipline not found", null);
        }

        if (!discipline.schedule) {
            return buildServiceResponse(400, "Schedule already deleted", null);
        }

        await this.disciplineRepository.deleteSchedule(id, session);

        return buildServiceResponse(200, null, null);
    }

    async registerClassroom(classroomId: string, disciplineId: string, session: SessionType): Promise<BasicServiceResponse> {
        const [discipline, classroom] = await Promise.all([
            this.findById(disciplineId, session),
            this.classroomRepository.findById(classroomId, session)
        ])
        if (!discipline) {
            return buildServiceResponse(
                404,
                "Discipline not found",
                null
            );
        }

        if (!classroom) {
            return buildServiceResponse(
                404,
                "Classroom not found",
                null
            );
        }

        const updatedDiscipline = await this.disciplineRepository.registerClassroom(classroomId, disciplineId, session);
        return buildServiceResponse(
            200,
            null,
            updatedDiscipline
        );
    }

    async removeClassroom(classroomId: string, disciplineId: string, session: SessionType): Promise<BasicServiceResponse> {
        const [discipline, classroom] = await Promise.all([
            this.findById(disciplineId, session),
            this.classroomRepository.findById(classroomId, session)
        ])
        if (!discipline) {
            return buildServiceResponse(
                404,
                "Discipline not found",
                null
            );
        }

        if (!classroom) {
            return buildServiceResponse(
                404,
                "Classroom not found",
                null
            );
        }

        const updatedDiscipline = await this.disciplineRepository.removeClassroom(classroomId, disciplineId, session);
        return buildServiceResponse(
            200,
            null,
            updatedDiscipline
        );
    }
}

export { DisciplineService };