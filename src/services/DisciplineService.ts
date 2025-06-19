import { SessionType } from "../intefaces/config/IntDatabase";
import { IDiscipline, IDisciplineCreate } from "../intefaces/entities/Discipline";
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
}

export { DisciplineService };