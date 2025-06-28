import DisciplineController from "../controllers/DisciplineController";
import { DisciplineMongooseRepository } from "../repositories/DisciplineMongooseRepository";
import ClassroomMongooseRepository from "../repositories/ClassroomMongooseRepository";
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
const classroomRepository = new ClassroomMongooseRepository();

// Services
const databaseService = mongooseContainer.mongooseService;
const disciplineService = new DisciplineService({
    disciplineRepository,
    classroomRepository: classroomRepository
});
const logService = new LogService();
const notificationService = new EmailService();
const userService = new UserService({
    userRepository: userMongooseRepository,
    disciplineRepository
});

// Validators
const validator = new DisciplineZodValidator();

// Controllers
export const disciplineController = new DisciplineController({
    disciplineService,
    logService,
    notificationService,
    validator,
    userService,
    databaseService
});