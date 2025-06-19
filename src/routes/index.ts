import { Router } from 'express';
import userRoutes from './paths/UserRoutes';
import disciplineRoutes from './paths/DisciplineRoutes';

const router = Router();
router.use('/user', userRoutes);
router.use('/discipline', disciplineRoutes);

router.get('/', (req, res) => {
    res.send('API funcionando com Express + MongoDB + TypeScript');
});

export default router;
