import mongoose from "mongoose";
import { IDatabaseService } from "../intefaces/services/IDatabaseService";
import { IDisciplineService } from "../intefaces/services/IDisciplineService";
import { ILogService } from "../intefaces/services/ILogService";
import { IntNotificationService } from "../intefaces/services/IntNotificationService";
import { IntUserService } from "../intefaces/services/IntUserService";
import { IntDisciplineValidator } from "../intefaces/validators/IntDisciplineValidator";
import { Request, Response } from "express";

interface DataProps {
    disciplineService: IDisciplineService;
    logService: ILogService;
    notificationService: IntNotificationService;
    validator: IntDisciplineValidator;
    userService: IntUserService;
    databaseService: IDatabaseService;
}

class DisciplineController {
    private disciplineService: IDisciplineService;
    private logService: ILogService;
    private notificationService: IntNotificationService;
    private validator: IntDisciplineValidator;
    private userService: IntUserService;
    private databaseService: IDatabaseService;

    constructor(data: DataProps) {
        this.disciplineService = data.disciplineService;
        this.logService = data.logService;
        this.notificationService = data.notificationService;
        this.validator = data.validator;
        this.userService = data.userService;
        this.databaseService = data.databaseService;
    }

    async create(req: any, res: any) {
        try {
            const { success, error, data } = this.validator.validateCreateDiscipline(req.body);
            if (!success) {
                return res.status(400).json({
                    errors: error
                });
            }

            const discipline = await this.disciplineService.create(data);
            return res.status(201).json(discipline);
        } catch (error: any) {
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    }

    async registerStudents(req: any, res: any) {
        try {
            const { success, error, data } = this.validator.validateRegisterStudents(req.params);
            if (!success) {
                return res.status(400).json({
                    errors: error
                });
            }

            const {
                studentId: userId,
                disciplineId
            } = data;

            const user = await this.userService.findUserById(userId, null);
            if (!user) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }

            const result = await this.disciplineService.subscribeStudentToDiscipline(disciplineId, user, null);
            if (result.status !== 200) {
                return res.status(result.status).json({
                    errors: [result.error]
                });
            }

            this.notificationService.sendNotification(`O aluno ${user.name} foi inscrito na disciplina ${result.data.name}`);

            return res.status(200).json(result.data);
        } catch (error: any) {
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    }

    async removeStudent(req: any, res: any) {
        try {
            const { success, error, data } = this.validator.validateRegisterStudents(req.params);
            if (!success) {
                return res.status(400).json({
                    errors: error
                });
            }

            const {
                studentId: userId,
                disciplineId
            } = data;

            const user = await this.userService.findUserById(userId, null);
            if (!user) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }

            const result = await this.disciplineService.unsubscribeStudentFromDiscipline(disciplineId, user, null);
            if (result.status !== 200) {
                return res.status(result.status).json({
                    errors: [result.error]
                });
            }

            this.notificationService.sendNotification(`O aluno ${user.name} foi removido da disciplina ${result.data.name}`);

            return res.status(200).json(result.data);
        } catch (error: any) {
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    }

    async registerTeacher(req: any, res: any) {
        try {
            const { success, error, data } = this.validator.validateRegisterTeacher(req.params);
            if (!success) {
                return res.status(400).json({
                    errors: error
                });
            }

            const {
                teacherId: userId,
                disciplineId
            } = data;

            const user = await this.userService.findUserById(userId, null);
            if (!user) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }

            const result = await this.disciplineService.subscribeTeacherToDiscipline(disciplineId, user, null);
            if (result.status !== 200) {
                return res.status(result.status).json({
                    errors: [result.error]
                });
            }

            return res.status(200).json(result.data);
        } catch (error: any) {
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    }

    async removeTeacher(req: any, res: any) {
        try {
            const { success, error, data } = this.validator.validateRegisterTeacher(req.params);
            if (!success) {
                return res.status(400).json({
                    errors: error
                });
            }

            const {
                teacherId: userId,
                disciplineId
            } = data;

            const user = await this.userService.findUserById(userId, null);
            if (!user) {
                return res.status(404).json({
                    error: 'User not found'
                });
            }

            const result = await this.disciplineService.unsubscribeTeacherFromDiscipline(disciplineId, user, null);
            if (result.status !== 200) {
                return res.status(result.status).json({
                    errors: [result.error]
                });
            }

            return res.status(200).json(result.data);
        } catch (error: any) {
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    }

    async getAll(req: any, res: any) {
        try {
            const result = await this.disciplineService.getAll();
            return res.status(200).json(result);
        } catch (error: any) {
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    }

    async deleteById(req: any, res: any) {
        try {
            const { id } = req.params;
            const session = await mongoose.startSession();

            session.startTransaction();

            try {
                await this.disciplineService.deleteById(id, session);
                await session.commitTransaction();
            } catch (error) {
                await session.abortTransaction();
            } finally {
                await session.endSession();
            }

            return res.status(200).json({
                message: "Disciplina deletada com sucesso!"
            });
        } catch (error: any) {
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    }

    async getById(req: any, res: any) {
        try {
            const { id } = req.params;

            const result = await this.disciplineService.findById(id, null);
            if (!result) {
                return res.status(404).json({
                    error: 'Discipline not found'
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

    async createSchedule(req: any, res: any) {
        try {
            const { id } = req.params;
            const { success, error, data } = this.validator.validateRegisterSchedule(req.body);

            if (!success) {
                return res.status(400).json({
                    errors: error
                });
            }

            const result = await this.disciplineService.createSchedule(id, data, null);
            if (result.status === 200) {
                return res.status(200).json(result.data);
            }

            return res.status(result.status).json({
                errors: { error: result.error }
            });
        } catch (error: any) {
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    }

    async deleteSchedule(req: any, res: any) {
        try {
            const { id } = req.params;

            const result = await this.disciplineService.deleteSchedule(id, null);
            if (result.status === 200) {
                return res.status(200).json({
                    message: 'Schedule deleted'
                });
            }

            return res.status(result.status).json({
                errors: {
                    error: result.error
                }
            });
        } catch (error: any) {
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    }

    async registerClassroom(req: Request, res: Response): Promise<any> {
        try {
            const {
                classroomId,
                disciplineId
            } = req.params;

            const result = await this.disciplineService.registerClassroom(classroomId, disciplineId, null);
            if (result.status === 200) {
                return res.status(200).json(result.data);
            }

            return res.status(result.status as number).json({
                errors: { error: result.error }
            });
        } catch (error: any) {
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    }

    async removeClassroom(req: Request, res: Response): Promise<any> {
        try {
            const {
                classroomId,
                disciplineId
            } = req.params;

            const result = await this.disciplineService.removeClassroom(classroomId, disciplineId, null);
            if (result.status === 200) {
                return res.status(200).json(result.data);
            }

            return res.status(result.status as number).json({
                errors: { error: result.error }
            });
        } catch (error: any) {
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    }
}

export default DisciplineController;