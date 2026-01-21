import express, { RequestHandler } from 'express';
import { register, login, getProfileDetails } from '@/controllers';
import  auth  from '@/middleware/auth.middleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', auth, getProfileDetails as unknown as RequestHandler);

export default router;
