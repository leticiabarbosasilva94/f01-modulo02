import { Router } from 'express';
import multer from 'multer';

import * as UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import ProviderController from './app/controllers/ProviderController';
import AppointmentController from './app/controllers/AppointmentController';

import multerConfig from './config/multer';

import authMiddleware from './app/middlewares/auth';

const router = new Router();
const upload = multer(multerConfig);

router.post('/sessions', SessionController.store);

router.post('/users', UserController.store);

router.use(authMiddleware);

router.put('/users/update/', UserController.update);

router.get('/providers', ProviderController.index);

router.post('/appointments', AppointmentController.store);

// Files
router.post(
  '/files/',
  authMiddleware,
  upload.single('file'),
  FileController.store
);

export default router;
