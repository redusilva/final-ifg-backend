import { Router } from 'express';
import userRoutes from './paths/UserRoutes';
import disciplineRoutes from './paths/DisciplineRoutes';
import classroomRoutes from './paths/ClassroomRoutes';
import attendanceRoutes from './paths/AttendanceRoutes';
import reportRoutes from './paths/ReportRoutes';
import { processAbsences } from '../jobs/finalizeAttendance';

const router = Router();
router.use('/user', userRoutes);
router.use('/discipline', disciplineRoutes);
router.use('/classroom', classroomRoutes);
router.use('/attendance', attendanceRoutes);
router.use('/report', reportRoutes);

router.post('/run-job', async (req, res) => {
    try {
        await processAbsences();
        res.status(200).send('Job executado com sucesso!');
    } catch (error) {
        res.status(500).send('Erro ao executar o job.');
    }
});

router.get('/', (req, res) => {
    res.send('API funcionando com Express + MongoDB + TypeScript');
});

export default router;
