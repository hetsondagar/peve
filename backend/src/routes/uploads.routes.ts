import { Router } from 'express';
import { uploadFile } from '../controllers/uploads.controller';
import { requireAuth } from '../middlewares/auth';

const router = Router();

router.post('/', requireAuth, uploadFile);

export default router;


