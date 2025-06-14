import express from 'express';
import router from './routes';
import { config } from './confg/env';
import cors from 'cors';
import { swaggerConfig } from './swagger';
import swaggerUi from 'swagger-ui-express';

const app = express();

app.use(express.json());
app.use(router);
app.use(cors({
    origin: '*',
}));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerConfig));

app.listen(config.PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${config.PORT}`);
});
