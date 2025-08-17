import { Request, Response } from "express";
import { IDatabaseService } from "../intefaces/services/IDatabaseService";
import { IAttendanceService } from "../intefaces/services/IAttendanceService";
import { ILogService } from "../intefaces/services/ILogService";
import { IntAttendanceValidator } from "../intefaces/validators/IntAttendanceValidator";

interface Props {
    attendanceService: IAttendanceService;
    databaseService: IDatabaseService;
    logService: ILogService;
    validator: IntAttendanceValidator;
}

class AttendanceController {
    private attendanceService: IAttendanceService;
    private databaseService: IDatabaseService;
    private logService: ILogService;
    private validator: IntAttendanceValidator;

    constructor(data: Props) {
        this.attendanceService = data.attendanceService;
        this.databaseService = data.databaseService;
        this.logService = data.logService;
        this.validator = data.validator;
    }

    async checkPresence(req: Request, res: Response) {
        const validationResult = this.validator.validateCheckPresence(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ errors: validationResult.error });
        }

        const session = await this.databaseService.startTransaction();
        try {
            const { studentId, disciplineId, isPresent, startTime, classDate } = validationResult.data;

            const result = await this.attendanceService.checkPresence(studentId, disciplineId, isPresent, startTime, classDate, session);

            if (!result) {
                await this.databaseService.commitTransaction(session);
                return res.status(200).json({ message: 'Check received, no action needed.' });
            }

            if (result.status !== 200) {
                await this.databaseService.rollbackTransaction(session);
                return res.status(result.status as number).json({ error: result.error });
            }

            await this.databaseService.commitTransaction(session);

            return res.status(200).json(result.data);

        } catch (error: any) {
            await this.databaseService.rollbackTransaction(session);
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async checkTeacherPresence(req: Request, res: Response) {
        const validationResult = this.validator.validateCheckTeacherPresence(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ errors: validationResult.error });
        }

        const session = await this.databaseService.startTransaction();
        try {
            const { teacherId, disciplineId, isPresent, startTime, classDate } = validationResult.data;

            const result = await this.attendanceService.checkTeacherPresence(teacherId, disciplineId, isPresent, startTime, classDate, session);

            if (!result) {
                await this.databaseService.commitTransaction(session);
                return res.status(200).json({ message: 'Check received, no action needed.' });
            }

            if (result.status !== 200) {
                await this.databaseService.rollbackTransaction(session);
                return res.status(result.status as number).json({ error: result.error });
            }

            await this.databaseService.commitTransaction(session);

            return res.status(200).json(result.data);

        } catch (error: any) {
            await this.databaseService.rollbackTransaction(session);
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default AttendanceController;