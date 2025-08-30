import { ReportController } from '../controllers/ReportController';
import { ReportService } from '../services/ReportService';
import { DisciplineModel } from '../models/DisciplineMongooseModel';
import { UserModel } from '../models/UserMongooseModel';
import { AttendanceModel } from '../models/AttendanceMongooseModel';
import { Model } from 'mongoose';
import { IDiscipline } from '../intefaces/entities/Discipline'; 
import { IUser } from '../intefaces/entities/User';
import { IAttendance } from '../intefaces/entities/Attendance';

const reportService = new ReportService({
    disciplineModel: DisciplineModel as unknown as Model<IDiscipline>,
    userModel: UserModel as unknown as Model<IUser>,
    attendanceModel: AttendanceModel as unknown as Model<IAttendance>,
});

export const reportController = new ReportController({ reportService });