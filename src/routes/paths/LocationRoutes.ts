import express from 'express';
import { validateMongoIdParams } from '../../middlewares/validateMongoIdParams';
import { locationController } from '../../container/LocationContainer';

const router = express.Router();

router.post(
    '/',
    (req, res): Promise<any> => locationController.createLocation(req, res)
);

router.get(
    '/',
    (req, res): Promise<any> => locationController.getAll(req, res)
)

router.get(
    '/:id',
    validateMongoIdParams,
    (req, res): Promise<any> => locationController.getById(req, res)
)

router.delete(
    '/:id',
    validateMongoIdParams,
    (req, res): Promise<any> => locationController.deleteById(req, res)
)

export default router;
