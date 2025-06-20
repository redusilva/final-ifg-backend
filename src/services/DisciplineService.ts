import { SessionType } from "../intefaces/config/IntDatabase";
import { IDiscipline, IDisciplineCreate, IDisciplineReport, Schedule } from "../intefaces/entities/Discipline";
import { IUser } from "../intefaces/entities/User";
import { IDisciplineRepository } from "../intefaces/repositories/IDisciplineRepository";
import { IDisciplineService } from "../intefaces/services/IDisciplineService";
import { BasicServiceResponse } from "../intefaces/types";

interface DataProps {
    disciplineRepository: IDisciplineRepository;
}

class DisciplineService implements IDisciplineService {
    private disciplineRepository: IDisciplineRepository;

    constructor(data: DataProps) {
        this.disciplineRepository = data.disciplineRepository;
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
            return {
                status: 404,
                error: 'Discipline not found',
                data: null
            }
        }

        if (user.type !== 'student') {
            return {
                status: 400,
                error: 'User is not a student',
                data: null
            }
        }

        const alreadySubscribed = discipline.students.find((student) => student === user.id);
        if (alreadySubscribed) {
            return {
                status: 400,
                error: 'User is already subscribed to this discipline',
                data: null
            }
        }

        const updatedDiscipline = await this.disciplineRepository.subscribeStudentToDiscipline(disciplineId, user.id, session);
        return {
            status: 200,
            error: null,
            data: updatedDiscipline
        };
    }

    async unsubscribeStudentFromDiscipline(disciplineId: string, user: IUser, session: SessionType): Promise<BasicServiceResponse> {
        const discipline = await this.findById(disciplineId, session);
        if (!discipline) {
            return {
                status: 404,
                error: 'Discipline not found',
                data: null
            }
        }

        if (user.type !== 'student') {
            return {
                status: 400,
                error: 'User is not a student',
                data: null
            }
        }

        const alreadySubscribed = discipline.students.find((student) => student === user.id);
        if (!alreadySubscribed) {
            return {
                status: 400,
                error: 'User is not subscribed to this discipline',
                data: null
            }
        }

        const updatedDiscipline = await this.disciplineRepository.unsubscribeStudentFromDiscipline(disciplineId, user.id, session);
        return {
            status: 200,
            error: null,
            data: updatedDiscipline
        };
    }

    async subscribeTeacherToDiscipline(disciplineId: string, user: IUser, session: SessionType): Promise<BasicServiceResponse> {
        const discipline = await this.findById(disciplineId, session);
        if (!discipline) {
            return {
                status: 404,
                error: 'Discipline not found',
                data: null
            }
        }

        if (user.type !== 'teacher') {
            return {
                status: 400,
                error: 'User is not a teacher',
                data: null
            }
        }

        const alreadySubscribed = discipline.teacher_id === user.id;
        if (alreadySubscribed) {
            return {
                status: 400,
                error: 'User is already subscribed to this discipline',
                data: null
            }
        }

        const updatedDiscipline = await this.disciplineRepository.subscribeTeacherToDiscipline(disciplineId, user.id, session);
        return {
            status: 200,
            error: null,
            data: updatedDiscipline
        };
    }

    async unsubscribeTeacherFromDiscipline(disciplineId: string, user: IUser, session: SessionType): Promise<BasicServiceResponse> {
        const discipline = await this.findById(disciplineId, session);
        if (!discipline) {
            return {
                status: 404,
                error: 'Discipline not found',
                data: null
            }
        }

        if (user.type !== 'teacher') {
            return {
                status: 400,
                error: 'User is not a teacher',
                data: null
            }
        }

        const alreadySubscribed = discipline.teacher_id === user.id;
        if (!alreadySubscribed) {
            return {
                status: 400,
                error: 'User is not subscribed to this discipline',
                data: null
            }
        }

        const updatedDiscipline = await this.disciplineRepository.unsubscribeTeacherFromDiscipline(disciplineId, user.id, session);
        return {
            status: 200,
            error: null,
            data: updatedDiscipline
        };
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
            return {
                status: 404,
                data: null,
                error: "Discipline not found"
            }
        }

        if (discipline.schedule) {
            return {
                status: 400,
                data: null,
                error: "Schedule already created"
            }
        }

        const updatedDiscipline = await this.disciplineRepository.createSchedule(
            id,
            data,
            session
        )
        if (!updatedDiscipline) {
            throw new Error("Discipline not updated");
        }

        return {
            status: 200,
            data: updatedDiscipline,
            error: null
        }
    }

    async deleteSchedule(id: string, session: SessionType): Promise<BasicServiceResponse> {
        const discipline = await this.findById(id, session);
        if (!discipline) {
            return {
                status: 404,
                data: null,
                error: "Discipline not found"
            }
        }

        if (!discipline.schedule) {
            return {
                status: 400,
                data: null,
                error: "Schedule already deleted"
            }
        }

        await this.disciplineRepository.deleteSchedule(id, session);

        return {
            status: 200,
            data: null,
            error: null
        }
    }
}

export { DisciplineService };