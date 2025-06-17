import UserController from "../controllers/UserController";
import UserMongooseRepository from "../repositories/UserMongooseRepository";
import { EmailService } from "../services/EmailService";
import { LogService } from "../services/LogService";
import UserService from "../services/UserService";
import UserZodValidator from "../validators/UserZodValidator";
import { mongooseContainer } from "./MongooseContainer";

const userMongooseRepository = new UserMongooseRepository();

const userService = new UserService({
    userRepository: userMongooseRepository
});
const databaseService = mongooseContainer.mongooseService;
const logService = new LogService();
const notificationService = new EmailService();

const validator = new UserZodValidator();

const userController = new UserController({
    userService,
    databaseService,
    validator,
    logService,
    notificationService
});

export { userController };