import express from 'express';
import AuthController from '../controllers/AuthController';
import AuthService from '../services/AuthService';
import AuthMongooseRepository from '../repositories/AuthMoongoseRepository';
import { MongooseService } from '../services/MongooseService';
import { config } from '../confg/env';
import { LogService } from '../services/LogService';
import { BcryptPasswordService } from '../services/BcryptPasswordService';
import { JwtTokenService } from '../services/JwtTokenService';

const router = express.Router();

router.post('/', async (req, res): Promise<any> => {
    const authRepository = new AuthMongooseRepository();
    const logService = new LogService();
    const tokenService = new JwtTokenService(config.JWT_SECRET);
    const passwordService = new BcryptPasswordService(config.PASSWORD_SALTS);
    const authService = new AuthService({
        authRepository
    });
    const databaseService = new MongooseService(config.MONGO_URI);
    const authController = new AuthController({
        databaseService,
        authService,
        logService,
        passwordService,
        tokenService
    });

    const result = await authController.create(req, res);
    return result;
});

router.post('/login', async (req, res): Promise<any> => {
    const authRepository = new AuthMongooseRepository();
    const logService = new LogService();
    const tokenService = new JwtTokenService(config.JWT_SECRET);
    const passwordService = new BcryptPasswordService(config.PASSWORD_SALTS);
    const authService = new AuthService({
        authRepository
    });
    const databaseService = new MongooseService(config.MONGO_URI);
    const authController = new AuthController({
        databaseService,
        authService,
        logService,
        passwordService,
        tokenService
    });

    const result = await authController.login(req, res);
    return result;
});

router.post('/token', async (req, res): Promise<any> => {
    const authRepository = new AuthMongooseRepository();
    const logService = new LogService();
    const tokenService = new JwtTokenService(config.JWT_SECRET);
    const passwordService = new BcryptPasswordService(config.PASSWORD_SALTS);
    const authService = new AuthService({
        authRepository
    });
    const databaseService = new MongooseService(config.MONGO_URI);
    const authController = new AuthController({
        databaseService,
        authService,
        logService,
        passwordService,
        tokenService
    });

    const result = await authController.token(req, res);
    return result;
});

router.get('/:id', async (req, res): Promise<any> => {
    const authRepository = new AuthMongooseRepository();
    const logService = new LogService();
    const tokenService = new JwtTokenService(config.JWT_SECRET);
    const passwordService = new BcryptPasswordService(config.PASSWORD_SALTS);
    const authService = new AuthService({
        authRepository
    });
    const databaseService = new MongooseService(config.MONGO_URI);
    const authController = new AuthController({
        databaseService,
        authService,
        logService,
        passwordService,
        tokenService
    });

    const result = await authController.getUser(req, res);
    return result;
});

router.delete('/:id', async (req, res): Promise<any> => {
    const authRepository = new AuthMongooseRepository();
    const logService = new LogService();
    const tokenService = new JwtTokenService(config.JWT_SECRET);
    const passwordService = new BcryptPasswordService(config.PASSWORD_SALTS);
    const authService = new AuthService({
        authRepository
    });
    const databaseService = new MongooseService(config.MONGO_URI);
    const authController = new AuthController({
        databaseService,
        authService,
        logService,
        passwordService,
        tokenService
    });

    const result = await authController.deleteUser(req, res);
    return result;
});

export default router;