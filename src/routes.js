import { Router } from 'express';
import multer from 'multer';
import * as UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';

const router = new Router();
const upload = multer(multerConfig);

router.post('/sessions', SessionController.store);

router.post('/users', UserController.store);
router.put('/users/update/', authMiddleware, UserController.update);

// Files
router.post(
  '/files/',
  authMiddleware,
  upload.single('file'),
  FileController.store
);

export default router;
