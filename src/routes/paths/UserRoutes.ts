import express from 'express';
import { userController } from '../../container/UserContainer';
import { validateMongoIdParams } from '../../middlewares/validateMongoIdParams';

const router = express.Router();

router.get(
    '/',
    validateMongoIdParams,
    (req, res): Promise<any> => userController.getAll(req, res)
);

router.post(
    '/',
    (req, res): Promise<any> => userController.create(req, res)
);

router.get(
    '/:id',
    validateMongoIdParams,
    (req, res): Promise<any> => userController.getById(req, res)
);

router.delete(
    '/:id',
    validateMongoIdParams,
    (req, res): Promise<any> => userController.deleteById(req, res)
);

router.get(
    '/:id/attendance-report',
    validateMongoIdParams,
    (req, res): Promise<any> => userController.getStudentAttendanceReport(req, res)
);

export default router;