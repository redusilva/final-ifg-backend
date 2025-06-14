import { config } from "../confg/env";
import AuthController from "../controllers/AuthController";
import { UserZodValidator } from "../intefaces/services/UserZodValidator";
import AuthMongooseRepository from "../repositories/AuthMoongoseRepository";
import AuthService from "../services/AuthService";
import { BcryptPasswordService } from "../services/BcryptPasswordService";
import { JwtTokenService } from "../services/JwtTokenService";
import { LogService } from "../services/LogService";
import { mongooseContainer } from "./MongooseContainer";

const logService = new LogService();
const validateService = new UserZodValidator();
const tokenService = new JwtTokenService(config.JWT_SECRET);
const passwordService = new BcryptPasswordService(config.PASSWORD_SALTS);
const authRepository = new AuthMongooseRepository();
const authService = new AuthService({ authRepository });

const authController = new AuthController({
    databaseService: mongooseContainer.mongooseService,
    authService,
    logService,
    passwordService,
    tokenService,
    validateService,
});

export { authController };
