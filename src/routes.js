import { Router } from 'express';
import * as UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const router = new Router();

router.post('/sessions', SessionController.store);

router.post('/users', UserController.store);
router.put('/users/update/', authMiddleware, UserController.update);

export default router;
