import express from 'express';
import { reportController } from '../../container/ReportContainer';
import { validateMongoIdParams } from '../../middlewares/validateMongoIdParams';

const router = express.Router();

router.get(
    '/discipline/:id',
    validateMongoIdParams,
    async (req, res) => {
        await reportController.getDisciplineReport(req, res);
    }
);

export default router;
