import express from 'express';
import { validateMongoIdParams } from '../../middlewares/validateMongoIdParams';
import { classroomController } from '../../container/ClassroomContainer';

const router = express.Router();

router.post(
    '/',
    (req, res): Promise<any> => classroomController.createClassroom(req, res)
);

router.get(
    '/',
    (req, res): Promise<any> => classroomController.getAll(req, res)
)

router.get(
    '/:id',
    validateMongoIdParams,
    (req, res): Promise<any> => classroomController.getById(req, res)
)

router.delete(
    '/:id',
    validateMongoIdParams,
    (req, res): Promise<any> => classroomController.deleteById(req, res)
)

export default router;
