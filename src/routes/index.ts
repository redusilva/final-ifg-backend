import { Router } from 'express';
import userRoutes from './paths/UserRoutes';

const router = Router();
router.use('/user', userRoutes);

router.get('/', (req, res) => {
    res.send('API funcionando com Express + MongoDB + TypeScript');
});

export default router;
