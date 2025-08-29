import { Router } from 'express';
import userRoutes from './paths/UserRoutes';
import disciplineRoutes from './paths/DisciplineRoutes';
import classroomRoutes from './paths/ClassroomRoutes';
import attendanceRoutes from './paths/AttendanceRoutes';
import reportRoutes from './paths/ReportRoutes';

const router = Router();
router.use('/user', userRoutes);
router.use('/discipline', disciplineRoutes);
router.use('/classroom', classroomRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/reports', reportRoutes);

router.get('/', (req, res) => {
    res.send('API funcionando com Express + MongoDB + TypeScript');
});

export default router;
