import ClassroomExpressController from "../controllers/ClassroomExpressController";
import { DisciplineMongooseRepository } from "../repositories/DisciplineMongooseRepository";
import ClassroomMongooseRepository from "../repositories/ClassroomMongooseRepository";
import ClassroomService from "../services/ClassroomService";
import { LogService } from "../services/LogService";
import ClassroomZodValidator from "../validators/ClassroomZodValidator";

// Repositories
const classroomRepository = new ClassroomMongooseRepository();
const disciplineRepository = new DisciplineMongooseRepository();

// Services
const classroomService = new ClassroomService({
    classroomRepository: classroomRepository,
    disciplineRepository
});
const logService = new LogService();

// Validators
const classroomValidator = new ClassroomZodValidator();

// Controllers
export const classroomController = new ClassroomExpressController({
    classroomService: classroomService,
    logService,
    classroomValidator: classroomValidator,
});