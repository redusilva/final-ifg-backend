import { Request, Response } from "express";
import { IDatabaseService } from "../intefaces/services/IDatabaseService";
import { IAuthService } from "../intefaces/services/IAuthService";
import { buildPublicUserData } from "../utils/builder";
import { IUser } from "../intefaces/entities/User";
import { ILogService } from "../intefaces/services/ILogService";
import { IPasswordService } from "../intefaces/services/IPasswordService";
import { ITokenService } from "../intefaces/services/ITokenService";
import { IUserValidator } from "../intefaces/services/IUserValidator";

type AuthControllerDependencies = {
    databaseService: IDatabaseService;
    authService: IAuthService;
    logService: ILogService;
    passwordService: IPasswordService;
    tokenService: ITokenService;
    validateService: IUserValidator;
};

class AuthController {
    private databaseService: IDatabaseService;
    private authService: IAuthService;
    private logService: ILogService;
    private passwordService: IPasswordService;
    private tokenService: ITokenService;
    private validateService: IUserValidator;

    constructor({
        databaseService,
        authService,
        logService,
        passwordService,
        tokenService,
        validateService
    }: AuthControllerDependencies) {
        this.databaseService = databaseService;
        this.authService = authService;
        this.logService = logService;
        this.passwordService = passwordService;
        this.tokenService = tokenService;
        this.validateService = validateService;
    }

    async login(req: Request, res: Response) {
        try {
            const body = req.body;
            const result = this.validateService.validateLoginUser(body);
            if (!result.success) {
                return res.status(400).json({
                    message: "Invalid request data",
                    errors: result.error.errors
                });
            }

            await this.databaseService.connect();
            const session = await this.databaseService.startTransaction();
            const user = await this.authService.getUserByEmail(req.body.email, session);
            if (!user) {
                await session.abortTransaction();
                return res.status(404).json({ message: "User not found" });
            }

            const isPasswordValid = await this.passwordService.comparePasswords(
                req.body.password,
                user.password
            );

            if (!isPasswordValid) {
                await session.abortTransaction();
                return res.status(401).json({ message: "Invalid password" });
            }

            const token = this.tokenService.generateToken({
                id: user.id,
                email: user.email,
                name: user.name,
                created_at: user.created_at,
                updated_at: user.updated_at
            });

            this.logService.createLog(
                `User with email ${user.email} and id ${user.id} logged in successfully at ${new Date().toISOString()}`,
                "info"
            );

            await session.commitTransaction();
            return res.status(200).json({
                message: "Login successful",
                token
            });
        } catch (error) {
            this.logService.createLog(
                `Error logging in user: ${error instanceof Error ? error.message : 'Unknown error'}`,
                "error"
            );
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const body = req.body;
            const result = this.validateService.validateCreateUser(body);
            if (!result.success) {
                return res.status(400).json({
                    message: "Invalid request data",
                    errors: result.error.errors
                });
            }

            await this.databaseService.connect();

            const session = await this.databaseService.startTransaction();

            const formattedPassword = await this.passwordService.hashPassword(
                result.data.password
            );

            const user = await this.authService.createUser(
                { ...result.data, password: formattedPassword },
                session
            );
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

    async token(req: Request, res: Response) {
        try {
            const body = req.body;

            const result = this.validateService.validateToken(body);
            if (!result.success) {
                return res.status(400).json({
                    message: "Invalid request data",
                    errors: result.error.errors
                });
            }

            const token = result.data.token;

            const isValid = this.tokenService.verifyToken(token);
            if (!isValid) {
                return res.status(401).json({ message: "Invalid token" });
            }

            return res.status(200).json({ message: "Token valid" });
        } catch (error) {
            this.logService.createLog(
                `Error validating token: ${error instanceof Error ? error.message : 'Unknown error'}`,
                "error"
            );
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    }

    async getUser(req: Request, res: Response) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            const isValid = this.tokenService.verifyToken(token || "");
            if (!isValid) {
                return res.status(401).json({ message: "User not authorized" });
            }

            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ message: "Invalid request data" });
            }

            await this.databaseService.connect();

            const user = await this.authService.getUserById(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            return res.status(200).json({
                message: "User found",
                user: buildPublicUserData(user)
            });
        } catch (error) {
            this.logService.createLog(
                `Error getting user: ${error instanceof Error ? error.message : 'Unknown error'}`,
                "error"
            );
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            const isValid = this.tokenService.verifyToken(token || "");
            if (!isValid) {
                return res.status(401).json({ message: "User not authorized" });
            }

            const id = req.params.id;
            if (!id) {
                return res.status(400).json({ message: "Invalid request data" });
            }

            await this.databaseService.connect();

            const user = await this.authService.getUserById(id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            await this.authService.deleteUserById(id);
            return res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            this.logService.createLog(
                `Error deleting user: ${error instanceof Error ? error.message : 'Unknown error'}`,
                "error"
            );
            return res.status(500).json({
                message: "Internal server error"
            });
        }
    }
}

export default AuthController;