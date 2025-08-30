import { MongooseService } from '../services/MongooseService';
import { config } from '../config/env';

export const mongooseContainer = {
    mongooseService: new MongooseService(config.MONGO_URI),
};
