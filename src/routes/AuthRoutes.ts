import express from 'express';
import { authController } from '../container/AuthContainer';

const router = express.Router();

router.post('/', (req, res): Promise<any> => authController.create(req, res));
router.post('/login', (req, res): Promise<any> => authController.login(req, res));
router.post('/token', (req, res): Promise<any> => authController.token(req, res));
router.get('/:id', (req, res): Promise<any> => authController.getUser(req, res));
router.delete('/:id', (req, res): Promise<any> => authController.deleteUser(req, res));

export default router;
