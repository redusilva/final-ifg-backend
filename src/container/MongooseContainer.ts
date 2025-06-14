import { MongooseService } from '../services/MongooseService';
import { config } from '../confg/env';

export const mongooseContainer = {
    mongooseService: new MongooseService(config.MONGO_URI),
};
