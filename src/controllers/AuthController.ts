import { Request, Response } from "express";
import { IDatabaseService } from "../intefaces/services/IDatabaseService";
import { IAuthService } from "../intefaces/services/IAuthService";
import { CreateUserValidator } from "../validators/UserValidator";
import { buildPublicUserData } from "../utils/builder";
import { IUser } from "../intefaces/entities/User";
import { IAuthController } from "../intefaces/controllers/IAuthController";
import { ILogService } from "../intefaces/services/ILogService";

type AuthControllerDependencies = {
    databaseService: IDatabaseService;
    authService: IAuthService;
    logService: ILogService;
};

class AuthController implements IAuthController {
    private databaseService: IDatabaseService;
    private authService: IAuthService;
    private logService: ILogService;

    constructor({
        databaseService,
        authService,
        logService
    }: AuthControllerDependencies) {
        this.databaseService = databaseService;
        this.authService = authService;
        this.logService = logService;
    }

    async login(req: Request, res: Response) {
        await this.databaseService.connect();
        const session = await this.databaseService.startTransaction();
        const user = await this.authService.getUserByEmail(req.body.email, session);
        if (!user) {
            await session.abortTransaction();
            return res.status(404).json({ message: "User not found" });
        }
        await session.commitTransaction();
        return res.status(200).json({ user });
    }

    async create(req: Request, res: Response) {
        try {
            const body = req.body;
            const result = CreateUserValidator.safeParse(body);
            if (!result.success) {
                return res.status(400).json({
                    message: "Invalid request data",
                    errors: result.error.errors
                });
            }

            await this.databaseService.connect();

            const session = await this.databaseService.startTransaction();

            const user = await this.authService.createUser(result.data, session);
            if (user.status !== 201) {
                this.logService.createLog(
                    `Error creating user: ${user?.message}`,
                    "warn"
                )
                await session.abortTransaction();
                return res.status(user.status).json({ message: user?.message });
            }

            this.logService.createLog(
                `User with email ${user?.data?.email} and id ${user?.data?.id} created successfully at ${new Date().toISOString()}`,
                "info"
            )

            await session.commitTransaction();

            return res.status(user.status).json({
                message: user.message,
                user: buildPublicUserData(user?.data as IUser)
            });
        } catch (error) {
            this.logService.createLog(
                `Error creating user: ${error instanceof Error ? error.message : 'Unknown error'}`,
                "error"
            );
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    }
}

export default AuthController;