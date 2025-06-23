import { Router } from 'express';
import userRoutes from './paths/UserRoutes';
import disciplineRoutes from './paths/DisciplineRoutes';
import locationRoutes from './paths/LocationRoutes';

const router = Router();
router.use('/user', userRoutes);
router.use('/discipline', disciplineRoutes);
router.use('/location', locationRoutes);

router.get('/', (req, res) => {
    res.send('API funcionando com Express + MongoDB + TypeScript');
});

export default router;
