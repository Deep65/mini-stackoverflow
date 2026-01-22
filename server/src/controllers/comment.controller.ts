import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Comment, Question, Answer } from '@/models';
import { AuthRequest } from '@/types';
import { VoteTargetType } from '@/enums';

export const createComment = async (req: AuthRequest, res: Response) => {
  try {
    const { content, targetId, targetType } = req.body;

    if (targetType === VoteTargetType.Question) {
      const question = await Question.findById(targetId);
      if (!question) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Question not found' });
      }
    } else if (targetType === VoteTargetType.Answer) {
      const answer = await Answer.findById(targetId);
      if (!answer) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Answer not found' });
      }
    } else {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid target type' });
    }

    const comment = new Comment({
      content,
      author: req.user.userId,
      targetId,
      targetType,
    });

    await comment.save();
    await comment.populate('author', 'username reputation');

    res.json(comment);
  } catch (err: any) {
    console.error(err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
  }
};

export const getComments = async (req: AuthRequest, res: Response) => {
  try {
    const { targetId } = req.params;

    const comments = await Comment.find({ targetId })
      .populate('author', 'username reputation')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (err: any) {
    console.error(err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
  }
};
