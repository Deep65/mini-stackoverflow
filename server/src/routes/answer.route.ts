import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import auth from '@/middleware/auth.middleware';
import { vote } from '@/controllers';
import { VoteTargetType } from '@/enums';

const router = express.Router();

router.post(
  '/:id/vote',
  auth,
  (req: Request, res: Response, next: NextFunction) => {
    req.body.targetType = VoteTargetType.Answer;
    next();
  },
  vote as unknown as RequestHandler
);

export default router;
