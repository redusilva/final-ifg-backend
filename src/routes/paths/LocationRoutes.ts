import express from 'express';
import { validateMongoIdParams } from '../../middlewares/validateMongoIdParams';
import { locationController } from '../../container/LocationContainer';

const router = express.Router();

router.post(
    '/',
    (req, res): Promise<any> => locationController.createLocation(req, res)
);

export default router;
