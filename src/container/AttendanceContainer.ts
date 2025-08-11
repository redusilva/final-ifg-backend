import AttendanceController from "../controllers/AttendanceController";
import AttendanceMongooseRepository from "../repositories/AttendanceMongooseRepository";
import { DisciplineMongooseRepository } from "../repositories/DisciplineMongooseRepository";
import AttendanceService from "../services/AttendanceService";
import { LogService } from "../services/LogService";
import AttendanceZodValidator from "../validators/AttendanceZodValidator"; // <-- Adicionar import
import { mongooseContainer } from "./MongooseContainer";

// Repositories
const attendanceRepository = new AttendanceMongooseRepository();
const disciplineRepository = new DisciplineMongooseRepository();

// Services
const logService = new LogService();
const databaseService = mongooseContainer.mongooseService;
const attendanceService = new AttendanceService({
    attendanceRepository,
    disciplineRepository,
    logService
});

// Validators
const attendanceValidator = new AttendanceZodValidator();

// Controller
const attendanceController = new AttendanceController({
    attendanceService,
    databaseService,
    logService,
    validator: attendanceValidator
});

export { attendanceService, attendanceController };