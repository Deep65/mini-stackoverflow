import express, { RequestHandler } from 'express';
import auth from '@/middleware/auth.middleware';
import { createComment, getComments } from '@/controllers';

const router = express.Router();

router.post('/', auth, createComment as unknown as RequestHandler);
router.get('/:targetId', getComments as unknown as RequestHandler);

export default router;
