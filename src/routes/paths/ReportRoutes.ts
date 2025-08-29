import express from 'express';
import { reportController } from '../../container/ReportContainer';
import { validateMongoIdParams } from '../../middlewares/validateMongoIdParams';

const router = express.Router();

router.get(
    '/discipline/:id',
    validateMongoIdParams,
    async (req, res) => {
        // A função é assíncrona, mas não retorna nada explicitamente.
        // Ela simplesmente chama o método do controlador e espera que ele
        // resolva a resposta (res.json(), res.send(), etc.) internamente.
        await reportController.getDisciplineReport(req, res);
    }
);

export default router;