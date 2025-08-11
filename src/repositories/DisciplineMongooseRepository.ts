// src/repositories/DisciplineMongooseRepository.ts

import { Types } from "mongoose";
import { SessionType } from "../intefaces/config/IntDatabase";
import { IDiscipline, IDisciplineCreate, IDisciplineReport, IDisciplineSummary, Schedule } from "../intefaces/entities/Discipline";
import { IDisciplineRepository } from "../intefaces/repositories/IDisciplineRepository";
import { DisciplineModel } from "../models/DisciplineMongooseModel";
import { buildDiscipline, buildDisciplineItemReport, buildDisciplineItemSummary } from "../utils/builder";

class DisciplineMongooseRepository implements IDisciplineRepository {
    async createSchedule(id: string, data: Schedule, session: SessionType): Promise<IDiscipline | null> {
        const discipline = await DisciplineModel.findById(id).session(session);

        if (!discipline) {
            return null;
        }

        if (!discipline.schedule || !Array.isArray(discipline.schedule)) {
            discipline.schedule = [];
        }

        discipline.schedule.push(data);

        await discipline.save({ session });

        return buildDiscipline(discipline);
    }

    async findByDayOfWeek(day: number, session: SessionType): Promise<IDisciplineSummary[]> {
        const disciplines = await DisciplineModel
            .find({ "schedule.day_of_week": day })
            .populate('teacher_id', 'name')
            .populate('classroom_id', 'name')
            .session(session);

        return disciplines.flatMap(discipline => {
            const summaries = buildDisciplineItemSummary(discipline);
            return summaries.filter(summary => {
                const scheduleItem = discipline.schedule.find(s => s.start_time === summary.start_time);
                return scheduleItem?.day_of_week === day;
            });
        });
    }

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
        const discipline = await DisciplineModel.findByIdAndUpdate(disciplineId, { $push: { students: userId } }, { new: true, session });
        if (!discipline) throw new Error('Discipline not found');
        return buildDiscipline(discipline);
    }

    async unsubscribeStudentFromDiscipline(disciplineId: string, userId: string, session: SessionType): Promise<IDiscipline> {
        const discipline = await DisciplineModel.findByIdAndUpdate(disciplineId, { $pull: { students: userId } }, { new: true, session });
        if (!discipline) throw new Error('Discipline not found');
        return buildDiscipline(discipline);
    }

    async subscribeTeacherToDiscipline(disciplineId: string, userId: string, session: SessionType): Promise<IDiscipline> {
        const discipline = await DisciplineModel.findByIdAndUpdate(disciplineId, { teacher_id: userId }, { new: true, session });
        if (!discipline) throw new Error('Discipline not found');
        return buildDiscipline(discipline);
    }

    async unsubscribeTeacherFromDiscipline(disciplineId: string, userId: string, session: SessionType): Promise<IDiscipline> {
        const discipline = await DisciplineModel.findByIdAndUpdate(disciplineId, { $unset: { teacher_id: 1 } }, { new: true, session });
        if (!discipline) throw new Error('Discipline not found');
        return buildDiscipline(discipline);
    }

    async getAll(session: SessionType): Promise<IDisciplineReport[]> {
        const disciplines = await DisciplineModel
            .find()
            .populate('students')
            .populate('teacher_id')
            .populate('classroom_id')
            .session(session);
        return disciplines?.map(discipline => buildDisciplineItemReport(discipline)) || [];
    }

    async deleteById(id: string, session: SessionType): Promise<void> {
        await DisciplineModel.findByIdAndDelete(id).session(session);
    }

    async deleteSchedule(id: string, scheduleData: Partial<Schedule>, session: SessionType): Promise<IDiscipline | null> {
        return DisciplineModel.findByIdAndUpdate(
            id,
            { $pull: { schedule: { start_time: scheduleData.start_time, day_of_week: scheduleData.day_of_week } } },
            { new: true, session }
        );
    }

    async registerClassroom(classroomId: string, disciplineId: string, session: SessionType): Promise<IDiscipline> {
        const discipline = await DisciplineModel.findByIdAndUpdate(disciplineId, { classroom_id: classroomId }, { new: true, session });
        if (!discipline) throw new Error("Discipline not found");
        return buildDiscipline(discipline);
    }

    async removeClassroom(classroomId: string, disciplineId: string, session: SessionType): Promise<IDiscipline> {
        const discipline = await DisciplineModel.findByIdAndUpdate(disciplineId, { $unset: { classroom_id: 1 } }, { new: true, session });
        if (!discipline) throw new Error("Discipline not found");
        return buildDiscipline(discipline);
    }

    async removeClassroomFromAllDisciplines(classroomId: string, session: SessionType): Promise<void> {
        await DisciplineModel
            .updateMany(
                { classroom_id: classroomId },
                { $unset: { classroom_id: 1 } }
            )
            .session(session);
    }

    async removeUserFromAllDisciplines(userId: string, session: SessionType): Promise<void> {
        await Promise.all([
            DisciplineModel.updateMany(
                { teacher_id: userId },
                { $unset: { teacher_id: 1 } }
            ).session(session),
            DisciplineModel.updateMany(
                { students: userId },
                { $pull: { students: userId } }
            ).session(session)
        ]);
    }

    async findAllByDayOfWeek(day: number, session: SessionType): Promise<IDiscipline[]> {
        const disciplines = await DisciplineModel
            .find({ "schedule.day_of_week": day })
            .session(session);
        return disciplines?.map(discipline => buildDiscipline(discipline)) || [];
    }
}

export { DisciplineMongooseRepository };