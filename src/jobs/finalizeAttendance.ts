import cron from 'node-cron';
import { DisciplineModel } from '../models/DisciplineMongooseModel';
import { AttendanceModel } from '../models/AttendanceMongooseModel';

async function processAbsences() {
    console.log('Running hourly job to process absences...');
    const processDate = new Date();
    const dayOfWeek = processDate.getDay();
    processDate.setHours(0, 0, 0, 0);

    try {
        const pendingResult = await AttendanceModel.updateMany(
            { classDate: processDate, status: 'PENDING' },
            { $set: { status: 'ABSENT' } }
        );

        if (pendingResult.modifiedCount > 0) {
            console.log(`Updated ${pendingResult.modifiedCount} PENDING records to ABSENT.`);
        }

        const disciplinesOfTheDay = await DisciplineModel.find({
            "schedule.day_of_week": dayOfWeek
        }).select('students name');

        if (disciplinesOfTheDay.length === 0) {
            console.log(`No disciplines scheduled for day ${dayOfWeek}.`);
            return;
        }

        for (const discipline of disciplinesOfTheDay) {
            if (!discipline.students || discipline.students.length === 0) {
                continue;
            }

            const studentsWithAttendanceRecord = await AttendanceModel.find({
                disciplineId: discipline.id,
                classDate: processDate
            }).select('studentId');

            const studentIdsWithRecord = new Set(
                studentsWithAttendanceRecord.map(att => att.studentId.toString())
            );

            const absentStudents = discipline.students
                .map(id => id.toString())
                .filter(studentId => !studentIdsWithRecord.has(studentId));

            if (absentStudents.length > 0) {
                const newAbsences = absentStudents.map(studentId => ({
                    studentId,
                    disciplineId: discipline.id,
                    classDate: processDate,
                    status: 'ABSENT',
                    presenceChecks: 0,
                    checkTimestamps: []
                }));

                await AttendanceModel.insertMany(newAbsences);
                console.log(`Created ${newAbsences.length} new ABSENT records for discipline ${discipline.name}.`);
            }
        }
    } catch (error) {
        console.error("Error during hourly attendance finalization job:", error);
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