import { Response } from 'express';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { Vote, Question, Answer, User } from '@/models';
import { AuthRequest } from '@/types';
import { VoteTargetType, VoteValue } from '@/enums';
import { calculateReputationChange } from '@/utils';

export const vote = async (req: AuthRequest, res: Response) => {
  const { id: targetId } = req.params;
  const userId = req.user.userId;

  let requestedValue =
    typeof req.body.value === 'string' ? parseInt(req.body.value, 10) : req.body.value;

  if (requestedValue !== VoteValue.Upvote && requestedValue !== VoteValue.Downvote) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Invalid vote value. Must be 1 or -1.' });
  }

  const { targetType } = req.body as { targetType: VoteTargetType };
  const voteValue = requestedValue as VoteValue;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const sessionOptions = { session };

    const [existingVote, targetDoc] = await Promise.all([
      Vote.findOne({ user: userId, targetId, targetType }).session(session),
      targetType === VoteTargetType.Question
        ? Question.findById(targetId).session(session)
        : Answer.findById(targetId).session(session),
    ]);

    if (!targetDoc) {
      await session.abortTransaction();
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Target not found' });
    }

    const authorDoc = await User.findById(targetDoc.author).session(session);
    if (!authorDoc) {
      await session.abortTransaction();
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Author not found' });
    }

    const reputationChange = calculateReputationChange(targetType, voteValue, existingVote?.value);

    if (existingVote) {
      if (existingVote.value === voteValue) {
        await Vote.deleteOne({ _id: existingVote._id }).session(session);
      } else {
        existingVote.value = voteValue;
        await existingVote.save(sessionOptions);
      }
    } else {
      await Vote.create(
        [
          {
            user: userId,
            targetId,
            targetType,
            value: voteValue,
          },
        ],
        sessionOptions
      );
    }

    authorDoc.reputation = (authorDoc.reputation || 0) + reputationChange;
    await authorDoc.save(sessionOptions);

    const target = targetDoc as any;

    target.upvotes = target.upvotes.filter((id: any) => id.toString() !== userId.toString());
    target.downvotes = target.downvotes.filter((id: any) => id.toString() !== userId.toString());

    if (existingVote && existingVote.value === voteValue) {
    } else {
      if (voteValue === VoteValue.Upvote) {
        target.upvotes.push(userId);
      } else {
        target.downvotes.push(userId);
      }
    }

    await target.save(sessionOptions);

    // 6. Finalize
    await session.commitTransaction();
    res.json({ message: 'Vote processed successfully', reputationChange });
  } catch (err: any) {
    await session.abortTransaction();
    console.error('Vote Error:', err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Vote failed',
      error: err.message,
    });
  } finally {
    session.endSession();
  }
};
