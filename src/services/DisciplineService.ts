import { SessionType } from "../intefaces/config/IntDatabase";
import { IDiscipline, IDisciplineCreate, IDisciplineReport, Schedule } from "../intefaces/entities/Discipline";
import { IUser } from "../intefaces/entities/User";
import { IDisciplineRepository } from "../intefaces/repositories/IDisciplineRepository";
import { IClassroomRepository } from "../intefaces/repositories/IClassroomRepository";
import { IDisciplineService } from "../intefaces/services/IDisciplineService";
import { BasicServiceResponse } from "../intefaces/types";
import { buildServiceResponse } from "../utils/builder";

interface DataProps {
    disciplineRepository: IDisciplineRepository;
    classroomRepository: IClassroomRepository;
}

class DisciplineService implements IDisciplineService {
    private disciplineRepository: IDisciplineRepository;
    private classroomRepository: IClassroomRepository;

    constructor(data: DataProps) {
        this.disciplineRepository = data.disciplineRepository;
        this.classroomRepository = data.classroomRepository;
    }

    async findByDayOfWeek(day: number, session: SessionType): Promise<BasicServiceResponse> {
        const disciplines = await this.disciplineRepository.findByDayOfWeek(day, session);
        return buildServiceResponse(200, null, {
            count: disciplines.length,
            classes: disciplines
        });
    }

    async create(data: IDisciplineCreate): Promise<IDiscipline> {
        return this.disciplineRepository.create(data);
    }

    async findById(id: string, session: SessionType): Promise<IDiscipline | null> {
        return this.disciplineRepository.findById(id);
    }

    async subscribeStudentToDiscipline(disciplineId: string, user: IUser, session: SessionType): Promise<BasicServiceResponse> {
        const discipline = await this.findById(disciplineId, session);
        if (!discipline) {
            return buildServiceResponse(404, 'Discipline not found', null);
        }
        if (user.type !== 'student') {
            return buildServiceResponse(400, 'User is not a student', null);
        }
        if (discipline.students.includes(user.id)) {
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
        if (!discipline.students.includes(user.id)) {
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
        if (discipline.teacher_id === user.id) {
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
        if (discipline.teacher_id !== user.id) {
            return buildServiceResponse(400, 'User is not subscribed to this discipline', null);
        }
        const updatedDiscipline = await this.disciplineRepository.unsubscribeTeacherFromDiscipline(disciplineId, user.id, session);
        return buildServiceResponse(200, null, updatedDiscipline);
    }

    async getAll(session?: SessionType): Promise<IDisciplineReport[]> {
        return this.disciplineRepository.getAll(session);
    }

    async deleteById(id: string, session: SessionType): Promise<void> {
        await this.disciplineRepository.deleteById(id, session);
    }

    async createSchedule(id: string, data: Schedule, session: SessionType): Promise<BasicServiceResponse> {
        const discipline = await this.disciplineRepository.findById(id);
        if (!discipline) {
            return buildServiceResponse(404, "Discipline not found", null);
        }
        const scheduleExists = discipline.schedule?.some(
            s => s.day_of_week === data.day_of_week && s.start_time === data.start_time
        );
        if (scheduleExists) {
            return buildServiceResponse(400, "Schedule for this day and time already exists", null);
        }
        const updatedDiscipline = await this.disciplineRepository.createSchedule(id, data, session);
        return buildServiceResponse(201, null, updatedDiscipline);
    }

    async deleteSchedule(id: string, scheduleData: Partial<Schedule>, session: SessionType): Promise<BasicServiceResponse> {
        const discipline = await this.findById(id, session);
        if (!discipline) {
            return buildServiceResponse(404, "Discipline not found", null);
        }
        const updatedDiscipline = await this.disciplineRepository.deleteSchedule(id, scheduleData, session);
        return buildServiceResponse(200, null, updatedDiscipline);
    }

    async registerClassroom(classroomId: string, disciplineId: string, session: SessionType): Promise<BasicServiceResponse> {
        const [discipline, classroom] = await Promise.all([
            this.findById(disciplineId, session),
            this.classroomRepository.findById(classroomId, session)
        ]);
        if (!discipline) {
            return buildServiceResponse(404, "Discipline not found", null);
        }
        if (!classroom) {
            return buildServiceResponse(404, "Classroom not found", null);
        }
        const updatedDiscipline = await this.disciplineRepository.registerClassroom(classroomId, disciplineId, session);
        return buildServiceResponse(200, null, updatedDiscipline);
    }

    async removeClassroom(classroomId: string, disciplineId: string, session: SessionType): Promise<BasicServiceResponse> {
        const discipline = await this.findById(disciplineId, session);
        if (!discipline) {
            return buildServiceResponse(404, "Discipline not found", null);
        }
        if (discipline.classroom_id !== classroomId) {
            return buildServiceResponse(400, "This classroom is not registered to this discipline", null);
        }
        const updatedDiscipline = await this.disciplineRepository.removeClassroom(classroomId, disciplineId, session);
        return buildServiceResponse(200, null, updatedDiscipline);
    }
}

export { DisciplineService };