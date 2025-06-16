import express from 'express';
import { userController } from '../../container/UserContainer';

const router = express.Router();

router.post('/', (req, res): Promise<any> => userController.create(req, res));

export default router;
