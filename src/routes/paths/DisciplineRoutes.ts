import express from 'express';
import { disciplineController } from '../../container/DisciplineContainer';

const router = express.Router();

router.post('/', (req, res): Promise<any> => disciplineController.create(req, res));
router.post('/:disciplineId/students/:studentId', (req, res): Promise<any> => disciplineController.registerStudents(req, res));
router.delete('/:disciplineId/students/:studentId', (req, res): Promise<any> => disciplineController.removeStudent(req, res));

export default router;
