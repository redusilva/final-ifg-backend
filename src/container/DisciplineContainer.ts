import DisciplineController from "../controllers/DisciplineController";
import { DisciplineMongooseRepository } from "../repositories/DisciplineMongooseRepository";
import UserMongooseRepository from "../repositories/UserMongooseRepository";
import { DisciplineService } from "../services/DisciplineService";
import { EmailService } from "../services/EmailService";
import { LogService } from "../services/LogService";
import UserService from "../services/UserService";
import { DisciplineZodValidator } from "../validators/DisciplineZodValidator";
import { mongooseContainer } from "./MongooseContainer";

// Repositories
const disciplineRepository = new DisciplineMongooseRepository();
const userMongooseRepository = new UserMongooseRepository();

// Services
const databaseService = mongooseContainer.mongooseService;
const disciplineService = new DisciplineService({
    disciplineRepository
});
const logService = new LogService();
const notificationService = new EmailService();
const userService = new UserService({
    userRepository: userMongooseRepository
});

// Validators
const validator = new DisciplineZodValidator();

// Controllers
const disciplineController = new DisciplineController({
    disciplineService,
    logService,
    notificationService,
    validator,
    userService,
    databaseService
});

export { disciplineController };