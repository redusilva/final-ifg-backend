import LocationExpressController from "../controllers/LocationExpressController";
import { DisciplineMongooseRepository } from "../repositories/DisciplineMongooseRepository";
import LocationMongooseRepository from "../repositories/LocationMongooseRepository";
import LocationService from "../services/LocationService";
import { LogService } from "../services/LogService";
import LocationZodValidator from "../validators/LocationZodValidator";

// Repositories
const locationRepository = new LocationMongooseRepository();
const disciplineRepository = new DisciplineMongooseRepository();

// Services
const locationService = new LocationService({
    locationRepository,
    disciplineRepository
});
const logService = new LogService();

// Validators
const locationValidator = new LocationZodValidator();

// Controllers
const locationController = new LocationExpressController({
    locationService,
    logService,
    locationValidator,
});

export { locationController };