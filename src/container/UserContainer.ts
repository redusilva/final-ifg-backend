import UserController from "../controllers/UserController";
import { DisciplineMongooseRepository } from "../repositories/DisciplineMongooseRepository";
import UserMongooseRepository from "../repositories/UserMongooseRepository";
import { EmailService } from "../services/EmailService";
import { LogService } from "../services/LogService";
import UserService from "../services/UserService";
import UserZodValidator from "../validators/UserZodValidator";
import { mongooseContainer } from "./MongooseContainer";

// Repositories
const userMongooseRepository = new UserMongooseRepository();
const disciplineRepository = new DisciplineMongooseRepository();

// Services
const userService = new UserService({
    userRepository: userMongooseRepository,
    disciplineRepository
});
const databaseService = mongooseContainer.mongooseService;
const logService = new LogService();
const notificationService = new EmailService();

// Validators
const validator = new UserZodValidator();

// Controllers
const userController = new UserController({
    userService,
    databaseService,
    validator,
    logService,
    notificationService
});

export { userController };