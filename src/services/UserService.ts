import { SessionType } from "../intefaces/config/IntDatabase";
import { IntBasicUser, IUser, UserType } from "../intefaces/entities/User";
import { IDisciplineRepository } from "../intefaces/repositories/IDisciplineRepository";
import { IntUserRepository } from "../intefaces/repositories/IntUserRepository";
import { IntUserService } from "../intefaces/services/IntUserService";
import { AttendanceModel } from "../models/AttendanceMongooseModel";
import { DisciplineModel } from "../models/DisciplineMongooseModel";
import { buildServiceResponse } from "../utils/builder";

interface UserServiceProps {
    userRepository: IntUserRepository;
    disciplineRepository: IDisciplineRepository;
}

class UserService implements IntUserService {
    private userRepository: IntUserRepository;
    private disciplineRepository: IDisciplineRepository;

    constructor(data: UserServiceProps) {
        this.userRepository = data.userRepository;
        this.disciplineRepository = data.disciplineRepository;
    }

    async findUserByEmail(email: string, session: SessionType): Promise<IUser | null> {
        const currentUser = await this.userRepository.findUserByEmail(email, session);
        return currentUser;
    }

    async createUser(user: IntBasicUser, session: SessionType): Promise<IUser | null> {
        const newUser = await this.userRepository.createUser(user, session);
        return newUser;
    }

    async findUserById(id: string, session: SessionType): Promise<IUser | null> {
        const currentUser = await this.userRepository.findUserById(id, session);
        return currentUser;
    }

    async deleteUserById(id: string, session: SessionType): Promise<void> {
        await Promise.all([
            this.userRepository.deleteUserById(id, session),
            this.disciplineRepository.removeUserFromAllDisciplines(id, session)
        ])
    }

    async findAllUsers(session: SessionType): Promise<IUser[]> {
        const users = await this.userRepository.findAllUsers(session);
        return users;
    }

    async findAllUsersByType(type: UserType, session: SessionType): Promise<IUser[]> {
        const users = await this.userRepository.findAllUsersByType(type, session);
        return users;
    }

    async getStudentAttendanceReport(studentId: string, session: SessionType): Promise<any> {
        const student = await this.userRepository.findUserById(studentId, session);
        if (!student) {
            return buildServiceResponse(404, "Student not found", null);
        }

        const disciplines = await DisciplineModel.find({ students: studentId }).session(session);
        const report = [];

        for (const discipline of disciplines) {
            const studentAttendances = await AttendanceModel.find({
                studentId,
                disciplineId: discipline._id
            }).session(session);

            const teacherAttendances = await AttendanceModel.find({
                teacherId: discipline.teacher_id,
                disciplineId: discipline._id,
                status: 'PRESENT'
            }).session(session);

            const classesTaught = teacherAttendances.length;
            const remainingClasses = (discipline.total_classes as any || 0) - classesTaught;

            const present_count = studentAttendances.filter(a => a.status === 'PRESENT').length;
            const absent_count = studentAttendances.filter(a => a.status === 'ABSENT').length;
            const pending_count = studentAttendances.filter(a => a.status === 'PENDING').length;
            const total_students = discipline.students.length;

            report.push({
                student_name: student.name,
                discipline_name: discipline.name,
                total_classes: discipline.total_classes,
                classes_taught: classesTaught,
                remaining_classes: remainingClasses,
                present_count,
                absent_count,
                pending_count,
                total_students,
            });
        }

        return buildServiceResponse(200, null, report);
    }
}

export default UserService;