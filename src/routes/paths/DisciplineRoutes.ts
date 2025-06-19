import express from 'express';
import { disciplineController } from '../../container/DisciplineContainer';

const router = express.Router();

router.post('/', (req, res): Promise<any> => disciplineController.create(req, res));

export default router;
