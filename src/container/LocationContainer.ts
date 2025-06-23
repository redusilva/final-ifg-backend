import LocationExpressController from "../controllers/LocationExpressController";
import LocationMongooseRepository from "../repositories/LocationMongooseRepository";
import LocationService from "../services/LocationService";
import { LogService } from "../services/LogService";
import LocationZodValidator from "../validators/LocationZodValidator";

// Repositories
const locationRepository = new LocationMongooseRepository();

// Services
const locationService = new LocationService({
    locationRepository
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