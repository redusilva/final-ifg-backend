import { MongoClient, ServerApiVersion } from 'mongodb';
import { config } from './env';

const client = new MongoClient(config.MONGO_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

export default client;