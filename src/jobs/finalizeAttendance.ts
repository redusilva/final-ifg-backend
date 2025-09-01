import cron from 'node-cron';
import { DisciplineModel } from '../models/DisciplineMongooseModel';
import { AttendanceModel } from '../models/AttendanceMongooseModel';
import { Types } from 'mongoose';
import { EmailService } from '../services/EmailService';
import { UserModel } from '../models/UserMongooseModel';
import { getServiceToken } from '../utils/serviceAuth';
import { LogService } from '../services/LogService';

const emailService = new EmailService();
const logService = new LogService();

export async function processAbsences() {
    console.log('Running hourly job to process absences...');
    const now = new Date();
    const dayOfWeek = now.getDay();
    const currentTime = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');

    const processDate = new Date();
    processDate.setHours(0, 0, 0, 0);

    try {
        const disciplinesOfTheDay = await DisciplineModel.find({
            "schedule.day_of_week": dayOfWeek
        }).select('students name schedule teacher_id');

        if (disciplinesOfTheDay.length === 0) {
            console.log(`No disciplines scheduled for day ${dayOfWeek}.`);
            return;
        }

        const token = await getServiceToken();
        console.log('token final: ', token);
        if (!token) {
            console.error('Error getting service token');
            return;
        }

        for (const discipline of disciplinesOfTheDay) {
            if (!discipline.schedule || discipline.schedule.length === 0) {
                continue;
            }

            const todaySchedules = discipline.schedule.filter(s => s.day_of_week === dayOfWeek && s.end_time <= currentTime);

            for (const scheduleItem of todaySchedules) {
                const { start_time, end_time } = scheduleItem;
                let teacherIsPresent = false;

                if (discipline.teacher_id) {
                    const teacherAttendance = await AttendanceModel.findOne({
                        teacherId: discipline.teacher_id,
                        disciplineId: discipline._id,
                        classDate: processDate,
                        start_time: start_time,
                        status: 'PRESENT'
                    });

                    if (teacherAttendance) {
                        teacherIsPresent = true;
                    }
                }

                if (!teacherIsPresent) {
                    console.log(`Class canceled for discipline ${discipline.name} at ${start_time} (teacher absent or not assigned). Deleting student attendance records.`);
                    await AttendanceModel.deleteMany({
                        disciplineId: discipline._id,
                        classDate: processDate,
                        start_time: start_time,
                        studentId: { $exists: true }
                    });
                    continue;
                }

                await AttendanceModel.updateMany(
                    {
                        disciplineId: discipline._id,
                        classDate: processDate,
                        start_time: start_time,
                        status: 'PENDING',
                        studentId: { $exists: true }
                    },
                    { $set: { status: 'ABSENT' } }
                );

                if (!discipline.students || discipline.students.length === 0) {
                    continue;
                }

                const studentsWithRecord = await AttendanceModel.find({
                    disciplineId: discipline._id,
                    classDate: processDate,
                    start_time: start_time,
                    studentId: { $exists: true }
                }).select('studentId');

                const studentIdsWithRecord = new Set(
                    studentsWithRecord.map(att => att.studentId!.toString())
                );

                const absentStudents = discipline.students
                    .map(id => id.toString())
                    .filter(studentId => !studentIdsWithRecord.has(studentId));

                if (absentStudents.length > 0) {
                    const newAbsences = absentStudents.map(studentId => ({
                        studentId: new Types.ObjectId(studentId),
                        disciplineId: discipline._id,
                        classDate: processDate,
                        start_time,
                        status: 'ABSENT',
                        presenceChecks: 0,
                        checkTimestamps: []
                    }));

                    await AttendanceModel.insertMany(newAbsences);
                    console.log(`Created ${newAbsences.length} ABSENT records for discipline ${discipline.name} at ${start_time}.`);

                    for (const studentId of absentStudents) {
                        const student = await UserModel.findById(studentId).select('name');
                        if (student) {
                            await emailService.sendNotification({
                                responsavelEmail: "rodrigoeduardo347@gmail.com",
                                alunoNome: student.name,
                                horarioInicio: start_time,
                                horarioFim: end_time,
                                token
                            });
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.error("Error during hourly attendance finalization job:", error);
    } finally {
        logService.createLog(`Hourly attendance finalization job executed at ${currentTime}.`, 'info');
    }
}

export const scheduleHourlyJob = () => {
    cron.schedule('0 * * * *', () => {
        console.log('-------------------------------------');
        console.log('Triggering scheduled hourly attendance job.');
        processAbsences();
        console.log('-------------------------------------');
    }, {
        timezone: "America/Sao_Paulo"
    });

    console.log("✅ Hourly attendance job scheduled successfully.");
};