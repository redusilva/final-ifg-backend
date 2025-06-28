import { IClassroomController } from "../intefaces/controllers/IClassroomController";
import { IClassroomService } from "../intefaces/services/IClassroomService";
import { ILogService } from "../intefaces/services/ILogService";
import { Request, Response } from "express";
import { IntClassroomValidator } from "../intefaces/validators/IntClassroomValidator";
import mongoose from "mongoose";

interface Props {
    classroomService: IClassroomService;
    logService: ILogService;
    classroomValidator: IntClassroomValidator;
}

class ClassroomExpressController implements IClassroomController {
    private classroomService: IClassroomService;
    private logService: ILogService;
    private classroomValidator: IntClassroomValidator;

    constructor(data: Props) {
        this.classroomService = data.classroomService;
        this.logService = data.logService;
        this.classroomValidator = data.classroomValidator;
    }

    async createClassroom(req: Request, res: Response) {
        try {
            const { success, error, data } = this.classroomValidator.validateCreateClassroom(req.body);
            if (!success) {
                return res.status(400).json({
                    errors: error
                });
            }

            const result = await this.classroomService.create(data, null);
            if (result.status === 201) {
                return res.status(201).json(result.data);
            }

            return res.status(result.status as number).json({
                errors: { error: result.error }
            });

        } catch (error: any) {
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({
                error: 'Internal Server Error'
            })
        }
    }

    async getAll(req: Request, res: Response): Promise<any> {
        try {
            const result = await this.classroomService.getAll(null);
            return res.status(200).json(result);
        } catch (error: any) {
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    }

    async getById(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;

            const result = await this.classroomService.findById(id, null);
            if (!result) {
                return res.status(404).json({
                    error: 'Classroom not found'
                });
            }

            return res.status(200).json(result);
        } catch (error: any) {
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    }

    async deleteById(req: Request, res: Response): Promise<any> {
        const session = await mongoose.startSession();

        try {
            const { id } = req.params;

            session.startTransaction();

            const result = await this.classroomService.deleteById(id, session);

            if (result.status !== 200) {
                await session.abortTransaction();
                return res.status(result.status as number).json({
                    error: result.error
                });
            }

            await session.commitTransaction();

            return res.status(200).json({
                message: 'Classroom deleted'
            });
        } catch (error: any) {
            await session.abortTransaction();
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        } finally {
            session.endSession();
        }
    }
}

export default ClassroomExpressController;