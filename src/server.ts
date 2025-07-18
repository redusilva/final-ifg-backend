import express from 'express';
import router from './routes';
import { config } from './confg/env';
import cors from 'cors';
import { swaggerConfig } from './confg/swagger';
import swaggerUi from 'swagger-ui-express';
import { mongooseContainer } from './container/MongooseContainer';
import authMiddleware from './middlewares/auth';

const app = express();

app.use(express.json());
app.use(cors({
    origin: '*',
}));

// Public routes
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));

// Private routes
app.use(authMiddleware);
app.use(router);

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
