import express from 'express';
import { disciplineController } from '../../container/DisciplineContainer';

const router = express.Router();

router.get('/', (req, res): Promise<any> => disciplineController.getAll(req, res));
router.post('/', (req, res): Promise<any> => disciplineController.create(req, res));
router.post('/:disciplineId/students/:studentId', (req, res): Promise<any> => disciplineController.registerStudents(req, res));
router.delete('/:disciplineId/students/:teacherId', (req, res): Promise<any> => disciplineController.removeStudent(req, res));
router.delete('/:disciplineId/teachers/:teacherId', (req, res): Promise<any> => disciplineController.removeTeacher(req, res));
router.post('/:disciplineId/teachers/:teacherId', (req, res): Promise<any> => disciplineController.registerTeacher(req, res));

export default router;
