import express from 'express';
import { attendanceController } from '../../container/AttendanceContainer';
import { validateMongoIdParams } from '../../middlewares/validateMongoIdParams';

const router = express.Router();

router.post(
    '/check',
    (req, res): Promise<any> => attendanceController.checkPresence(req, res)
);

router.post(
    '/check/teacher',
    (req, res): Promise<any> => attendanceController.checkTeacherPresence(req, res)
);

export default router;