import { SessionType } from "../intefaces/config/IntDatabase";
import { IAttendance } from "../intefaces/entities/Attendance";
import { IAttendanceRepository } from "../intefaces/repositories/IAttendanceRepository";
import { AttendanceModel } from "../models/AttendanceMongooseModel";
import { buildAttendance } from "../utils/builder";

class AttendanceMongooseRepository implements IAttendanceRepository {
    async findOne(conditions: any, session: SessionType): Promise<IAttendance | null> {
        const record = await AttendanceModel.findOne(conditions).session(session);
        return buildAttendance(record);
    }

    async create(data: Partial<IAttendance>, session: SessionType): Promise<IAttendance> {
        const newAttendanceData = {
            ...data,
            presenceChecks: 1,
            checkTimestamps: [new Date()],
            status: 'PENDING'
        };

        const newAttendance = new AttendanceModel(newAttendanceData);
        await newAttendance.save({ session });

        const builtRecord = buildAttendance(newAttendance);

        if (!builtRecord) {
            throw new Error("Failed to build attendance record after creation.");
        }

        return builtRecord;
    }

    async incrementCheck(attendanceId: string, session: SessionType): Promise<IAttendance | null> {
        const updatedRecord = await AttendanceModel.findByIdAndUpdate(
            attendanceId,
            {
                $inc: { presenceChecks: 1 },
                $push: { checkTimestamps: new Date() }
            },
            { new: true, session }
        );
        return buildAttendance(updatedRecord);
    }

    async updateMany(conditions: any, update: any, session: SessionType): Promise<{ modifiedCount: number; }> {
        const result = await AttendanceModel.updateMany(conditions, update).session(session);
        return { modifiedCount: result.modifiedCount };
    }

    async find(conditions: any, projection?: any, session?: SessionType): Promise<IAttendance[]> {
        const records = await AttendanceModel.find(conditions, projection).session(session).lean();
        return records.map(buildAttendance).filter(Boolean) as IAttendance[];
    }

    async insertMany(docs: any[], session: SessionType): Promise<IAttendance[]> {
        const createdDocs = await AttendanceModel.insertMany(docs, { session });
        return createdDocs.map(buildAttendance).filter(Boolean) as IAttendance[];
    }
}

export default AttendanceMongooseRepository;