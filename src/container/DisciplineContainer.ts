import DisciplineController from "../controllers/DisciplineController";
import { DisciplineMongooseRepository } from "../repositories/DisciplineMongooseRepository";
import LocationMongooseRepository from "../repositories/LocationMongooseRepository";
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
const locationRepository = new LocationMongooseRepository();

// Services
const databaseService = mongooseContainer.mongooseService;
const disciplineService = new DisciplineService({
    disciplineRepository,
    classroomRepository: locationRepository
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