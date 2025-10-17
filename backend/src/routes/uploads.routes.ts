import { Router } from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/uploads.controller';
import { requireAuth } from '../middlewares/auth';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

router.post('/', requireAuth, upload.single('file'), uploadFile);

export default router;


