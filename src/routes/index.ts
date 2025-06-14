import { Router } from 'express';
import authRoutes from './AuthRoutes';

const router = Router();
router.use('/auth', authRoutes);

router.get('/', (req, res) => {
    res.send('API funcionando com Express + MongoDB + TypeScript');
});

export default router;
