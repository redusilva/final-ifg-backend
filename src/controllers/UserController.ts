import { IDatabaseService } from "../intefaces/services/IDatabaseService";
import { IntUserService } from "../intefaces/services/IntUserService";
import { Request, Response } from "express";
import { IntUserValidator } from "../intefaces/validators/IntUserValidators";
import { IntBasicUser, IUser, UserType } from "../intefaces/entities/User";
import { ILogService } from "../intefaces/services/ILogService";
import { IntNotificationService } from "../intefaces/services/IntNotificationService";
import mongoose from "mongoose";

interface UserControllerProps {
    userService: IntUserService;
    databaseService: IDatabaseService;
    validator: IntUserValidator;
    logService: ILogService;
    notificationService: IntNotificationService;
}

class UserController {
    private userService: IntUserService;
    private databaseService: IDatabaseService;
    private validator: IntUserValidator;
    private logService: ILogService;
    private notificationService: IntNotificationService;

    constructor(data: UserControllerProps) {
        this.userService = data.userService;
        this.databaseService = data.databaseService;
        this.validator = data.validator;
        this.logService = data.logService;
        this.notificationService = data.notificationService;
    }

    async create(req: Request, res: Response) {
        try {
            const { success, error, data } = this.validator.validateCreateUser(req.body);
            if (!success) {
                return res.status(400).json({
                    errors: error
                })
            }
            const { name, email, type, phone, id }: IntBasicUser = data;

            const session = await this.databaseService.startTransaction();
            const currentUser = await this.userService.findUserByEmail(email, session);
            if (currentUser) {
                return res.status(400).json({
                    errors: {
                        email: 'Email already exists'
                    }
                })
            }

            const user = await this.userService.createUser({ name, email, type, phone, id }, session);
            if (!user) {
                await this.databaseService.rollbackTransaction(session);
                return res.status(400).json({
                    errors: {
                        email: 'Email already exists'
                    }
                })
            }

            await this.databaseService.commitTransaction(session);
            this.notificationService.sendNotification(
                `Seja bem vindo ao nosso sistema, ${user.name}!`
            );

            this.logService.createLog(`User ${user.name} created`, 'info');

            return res.status(201).json({
                user
            })
        } catch (error: any) {
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({
                error: 'Internal Server Error'
            })
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const user = await this.userService.findUserById(id, null);
            if (!user) {
                return res.status(404).json({
                    error: 'User not found'
                })
            }

            return res.status(200).json({
                user
            })
        } catch (error: any) {
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({
                error: 'Internal Server Error'
            })
        }
    }

    async deleteById(req: Request, res: Response) {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            const { id } = req.params;

            const user = await this.userService.findUserById(id, session);
            if (!user) {
                await session.abortTransaction();
                return res.status(404).json({
                    error: 'User not found'
                })
            }

            await this.userService.deleteUserById(id, session);

            await session.commitTransaction();

            this.logService.createLog(`User ${user.name} deleted`, 'info');

            return res.status(200).json({
                message: 'User deleted'
            })
        } catch (error: any) {
            await session.abortTransaction();
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({
                error: 'Internal Server Error'
            })
        } finally {
            session.endSession();
        }
    }

    async getAll(req: Request, res: Response) {
        try {
            const { filterBy } = req.query;
            const validFilters: UserType[] = ['student', 'teacher'];

            const users = validFilters.includes(filterBy as UserType)
                ? await this.userService.findAllUsersByType(filterBy as UserType, null)
                : await this.userService.findAllUsers(null);

            return res.status(200).json({ users });
        } catch (error: any) {
            this.logService.createLog(error.message, 'error');
            return res.status(500).json({
                error: 'Internal Server Error'
            });
        }
    }
}

export default UserController;