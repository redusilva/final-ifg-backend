import express from 'express';
import router from './routes';
import { config } from './confg/env';
import cors from 'cors';
import { swaggerConfig } from './swagger';
import swaggerUi from 'swagger-ui-express';
import { MongooseService } from './services/MongooseService';
import { mongooseContainer } from './container/MongooseContainer';

const app = express();

app.use(express.json());
app.use(router);
app.use(cors({
    origin: '*',
}));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));

async function start() {
    try {
        await mongooseContainer.mongooseService.connect();

        app.listen(config.PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${config.PORT}`);
        });

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
        process.exit(1);
    }
}

async function shutdown() {
    await mongooseContainer.mongooseService.disconnect();
    process.exit(0);
}

start();
