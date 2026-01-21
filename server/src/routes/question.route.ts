import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import { createQuestion, getQuestions, getQuestionById, createAnswer, vote } from '@/controllers';
import auth from '@/middleware/auth.middleware';
import { VoteTargetType } from '@/enums';

const router = express.Router();

router.get('/', getQuestions);
router.post('/', auth, createQuestion as unknown as RequestHandler);
router.get('/:id', getQuestionById);
router.post('/:id/answers', auth, createAnswer as unknown as RequestHandler);
router.post(
  '/:id/vote',
  auth,
  (req: Request, res: Response, next: NextFunction) => {
    req.body.targetType = VoteTargetType.Question;
    next();
  },
  vote as unknown as RequestHandler
);

export default router;
