import express from 'express';
import { disciplineController } from '../../container/DisciplineContainer';
import { validateMongoIdParams } from '../../middlewares/validateMongoIdParams';

const router = express.Router();

router.post(
    '/schedule/:id',
    validateMongoIdParams,
    (req, res) => disciplineController.createSchedule(req, res)
);

router.delete(
    '/schedule/:id',
    validateMongoIdParams,
    (req, res) => disciplineController.deleteSchedule(req, res)
);

router.delete(
    '/:disciplineId/students/:teacherId',
    validateMongoIdParams,
    (req, res) => disciplineController.removeStudent(req, res)
);

router.delete(
    '/:disciplineId/teachers/:teacherId',
    validateMongoIdParams,
    (req, res) => disciplineController.removeTeacher(req, res)
);

router.post(
    '/:disciplineId/teachers/:teacherId',
    validateMongoIdParams,
    (req, res) => disciplineController.registerTeacher(req, res)
);

router.post(
    '/:disciplineId/students/:studentId',
    validateMongoIdParams,
    (req, res) => disciplineController.registerStudents(req, res)
);

router.get(
    '/',
    (req, res) => disciplineController.getAll(req, res)
);

router.post(
    '/',
    (req, res) => disciplineController.create(req, res)
);

router.get(
    '/:id',
    validateMongoIdParams,
    (req, res) => disciplineController.getById(req, res)
);

router.delete(
    '/:id',
    validateMongoIdParams,
    (req, res) => disciplineController.deleteById(req, res)
);

export default router;
