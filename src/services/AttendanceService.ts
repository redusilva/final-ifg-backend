import { SessionType } from "../intefaces/config/IntDatabase";
import { IAttendanceRepository } from "../intefaces/repositories/IAttendanceRepository";
import { IDisciplineRepository } from "../intefaces/repositories/IDisciplineRepository";
import { IAttendanceService } from "../intefaces/services/IAttendanceService";
import { ILogService } from "../intefaces/services/ILogService";
import { BasicServiceResponse } from "../intefaces/types";
import { AttendanceModel } from "../models/AttendanceMongooseModel";
import { buildServiceResponse } from "../utils/builder";

interface Props {
    attendanceRepository: IAttendanceRepository;
    disciplineRepository: IDisciplineRepository;
    logService: ILogService;
}

class AttendanceService implements IAttendanceService {
    private attendanceRepository: IAttendanceRepository;
    private disciplineRepository: IDisciplineRepository;
    private logService: ILogService;

    constructor(data: Props) {
        this.attendanceRepository = data.attendanceRepository;
        this.disciplineRepository = data.disciplineRepository;
        this.logService = data.logService;
    }

    async checkPresence(studentId: string, disciplineId: string, isPresent: boolean, startTime: string, classDate: Date, session: SessionType): Promise<BasicServiceResponse> {
        if (!isPresent) {
            return buildServiceResponse(200, null, { message: 'Check received, no action needed.' });
        }

        const discipline = await this.disciplineRepository.findById(disciplineId);
        if (!discipline) {
            return buildServiceResponse(404, "Discipline not found", null);
        }

        const dayOfWeek = classDate.getUTCDay();
        const isValidSchedule = discipline.schedule?.some(
            s => s.day_of_week === dayOfWeek && s.start_time === startTime
        );

        if (!isValidSchedule) {
            return buildServiceResponse(400, `No class scheduled for this discipline at ${startTime} on this date.`, null);
        }

        let attendanceRecord = await this.attendanceRepository.findOne({
            studentId,
            disciplineId,
            classDate: classDate,
            start_time: startTime
        }, session);

        if (attendanceRecord) {
            if (attendanceRecord.presenceChecks >= 3) {
                return buildServiceResponse(200, null, { status: 'PRESENT', checks: attendanceRecord.presenceChecks });
            }
            attendanceRecord = await this.attendanceRepository.incrementCheck(attendanceRecord.id, session);
        } else {
            attendanceRecord = await this.attendanceRepository.create(studentId, disciplineId, classDate, startTime, session);
        }

        if (attendanceRecord && attendanceRecord.presenceChecks === 3) {
            await AttendanceModel.updateOne(
                { _id: attendanceRecord.id },
                { $set: { status: 'PRESENT' } }
            ).session(session);

            this.logService.createLog(`Student ${studentId} marked as PRESENT for discipline ${disciplineId} at ${startTime}`, 'info');

            return buildServiceResponse(200, null, { status: 'PRESENT', checks: 3 });
        }

        return buildServiceResponse(200, null, {
            status: attendanceRecord?.status || 'PENDING',
            checks: attendanceRecord?.presenceChecks || 0
        });
    }


    async processDailyAbsences(session: SessionType): Promise<void> {
        const processDate = new Date();
        const dayOfWeek = processDate.getDay();
        processDate.setHours(0, 0, 0, 0);

        await this.attendanceRepository.updateMany(
            { classDate: processDate, status: 'PENDING' },
            { $set: { status: 'ABSENT' } },
            session
        );

        const disciplinesOfTheDay = await this.disciplineRepository.findAllByDayOfWeek(dayOfWeek, session);

        for (const discipline of disciplinesOfTheDay) {
            if (!discipline.students || discipline.students.length === 0) continue;
            if (!discipline.schedule || discipline.schedule.length === 0) continue;

            for (const scheduleItem of discipline.schedule) {
                const { start_time } = scheduleItem;
                const studentsWithRecord = await this.attendanceRepository.find({
                    disciplineId: discipline.id,
                    classDate: processDate,
                    start_time
                }, 'studentId', session);

                const studentIdsWithRecord = new Set(studentsWithRecord.map(att => att.studentId.toString()));

                const absentStudents = discipline.students
                    .map(id => id.toString())
                    .filter(studentId => !studentIdsWithRecord.has(studentId));

                if (absentStudents.length > 0) {
                    const newAbsences = absentStudents.map(studentId => ({
                        studentId,
                        disciplineId: discipline.id,
                        classDate: processDate,
                        start_time,
                        status: 'ABSENT',
                        presenceChecks: 0,
                        checkTimestamps: []
                    }));
                    await this.attendanceRepository.insertMany(newAbsences, session);
                }
            }
        }
    }
}

export default AttendanceService;