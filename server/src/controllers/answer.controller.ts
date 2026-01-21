import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Answer } from '@/models';
import { AuthRequest } from '@/types';

export const createAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const { content } = req.body;
    const { id: questionId } = req.params;

    const answer = new Answer({
      content,
      author: req.user.userId,
      questionId,
    });

    await answer.save();
    await answer.populate('author', 'username reputation');

    res.json(answer);
  } catch (err: any) {
    console.error(err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
  }
};
