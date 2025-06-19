import DisciplineController from "../controllers/DisciplineController";
import { DisciplineMongooseRepository } from "../repositories/DisciplineMongooseRepository";
import { DisciplineService } from "../services/DisciplineService";
import { EmailService } from "../services/EmailService";
import { LogService } from "../services/LogService";
import { DisciplineZodValidator } from "../validators/DisciplineZodValidator";

const disciplineRepository = new DisciplineMongooseRepository();

const disciplineService = new DisciplineService({
    disciplineRepository
});
const logService = new LogService();
const notificationService = new EmailService();

const validator = new DisciplineZodValidator();

const disciplineController = new DisciplineController({
    disciplineService,
    logService,
    notificationService,
    validator
});

export { disciplineController };