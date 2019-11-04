import { Router } from 'express';
import { store } from './app/controllers/UserController';

const router = new Router();

router.post('/users', store);

export default router;
