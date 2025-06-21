import { Types } from "mongoose";
import { SessionType } from "../intefaces/config/IntDatabase";
import { IDiscipline, IDisciplineCreate, IDisciplineReport, Schedule } from "../intefaces/entities/Discipline";
import { IDisciplineRepository } from "../intefaces/repositories/IDisciplineRepository";
import { DisciplineModel } from "../models/DisciplineMongooseModel";
import { buildDiscipline, buildDisciplineItemRepost, buildSchedule } from "../utils/builder";

class DisciplineMongooseRepository implements IDisciplineRepository {
    async create(data: IDisciplineCreate): Promise<IDiscipline> {
        const discipline = new DisciplineModel(data);
        await discipline.save();

        return buildDiscipline(discipline);
    }

    async findById(id: string): Promise<IDiscipline | null> {
        const discipline = await DisciplineModel.findById(id);
        if (!discipline) {
            return null;
        }

        return buildDiscipline(discipline);
    }

    async subscribeStudentToDiscipline(disciplineId: string, userId: string, session: SessionType): Promise<IDiscipline> {
        const discipline = await DisciplineModel.findById(disciplineId).session(session);
        if (!discipline) {
            throw new Error('Discipline not found');
        }

        discipline.students.push(new Types.ObjectId(userId));

        await discipline.save({ session });

        return buildDiscipline(discipline);
    }

    async unsubscribeStudentFromDiscipline(
        disciplineId: string,
        userId: string,
        session: SessionType
    ): Promise<IDiscipline> {
        const discipline = await DisciplineModel.findById(disciplineId).session(session);
        if (!discipline) {
            throw new Error('Discipline not found');
        }

        discipline.students.pull(new Types.ObjectId(userId));

        await discipline.save({ session });

        return buildDiscipline(discipline);
    }

    async subscribeTeacherToDiscipline(disciplineId: string, userId: string, session: SessionType): Promise<IDiscipline> {
        const discipline = await DisciplineModel.findById(disciplineId).session(session);
        if (!discipline) {
            throw new Error('Discipline not found');
        }

        discipline.teacher_id = userId;

        await discipline.save({ session });

        return buildDiscipline(discipline);
    }

    async unsubscribeTeacherFromDiscipline(disciplineId: string, userId: string, session: SessionType): Promise<IDiscipline> {
        const discipline = await DisciplineModel.findById(disciplineId).session(session);
        if (!discipline) {
            throw new Error('Discipline not found');
        }

        discipline.teacher_id = null;

        await discipline.save({ session });

        return buildDiscipline(discipline);
    }

    async getAll(session: SessionType): Promise<IDisciplineReport[]> {
        const disciplines = await DisciplineModel
            .find()
            .populate('students')
            .populate('teacher_id')
            .session(session);

        return disciplines?.map(discipline => buildDisciplineItemRepost(discipline)) || [];
    }

    async deleteById(id: string, session: SessionType): Promise<void> {
        await DisciplineModel.findByIdAndDelete(id).session(session);
    }

    async createSchedule(id: string, data: Schedule, session: SessionType): Promise<Schedule> {
        const discipline = await DisciplineModel.findById(id).session(session);
        if (!discipline) {
            throw new Error("Discipline not found")
        }

        discipline.schedule = data;

        await discipline?.save({ session })
        return buildSchedule(discipline.schedule);
    }

    async deleteSchedule(id: string, session: SessionType): Promise<void> {
        const discipline = await DisciplineModel.findById(id).session(session);
        if (!discipline) {
            throw new Error("Discipline not found")
        }

        discipline.schedule = null;

        await discipline.save({ session })
    }
}

export { DisciplineMongooseRepository };