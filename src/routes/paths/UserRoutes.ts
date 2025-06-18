import express from 'express';
import { userController } from '../../container/UserContainer';

const router = express.Router();

router.get('/', (req, res): Promise<any> => userController.getAll(req, res));
router.post('/', (req, res): Promise<any> => userController.create(req, res));
router.get('/:id', (req, res): Promise<any> => userController.getById(req, res));
router.delete('/:id', (req, res): Promise<any> => userController.deleteById(req, res));

export default router;
