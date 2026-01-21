import { Response } from 'express';
import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import { Vote, Question, Answer, User } from '@/models';
import { AuthRequest } from '@/types';
import { VoteTargetType, VoteValue } from '@/enums';
import { calculateReputationChange } from '@/utils';

export const vote = async (req: AuthRequest, res: Response) => {
  const { id: targetId } = req.params;
  let { targetType, value } = req.body as { targetType: VoteTargetType; value: any };

  // Allow string input for value (e.g. "1" or "-1")
  if (typeof value === 'string') {
    value = parseInt(value, 10);
  }

  if (value !== VoteValue.Upvote && value !== VoteValue.Downvote) {
    return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid vote value. Must be 1 or -1.' });
  }

  // Cast back to VoteValue
  const voteValue = value as VoteValue;

  let session: mongoose.mongo.ClientSession | null = null;
  let useTransaction = false;

  try {
    session = await mongoose.startSession();
    session.startTransaction();
    useTransaction = true;
  } catch (error: any) {
    // If startSession failed, session is null. If startTransaction failed, we might have a session but shouldn't use it for atomic ops improperly.
    // If session exists but transaction failed, end it.
    if (session) {
      session.endSession();
      session = null;
    }
  }

  try {
    // Pass session if it exists (Mongoose handles null session by ignoring it usually, but let's be safe)
    const sessionOption = session ? { session } : {};

    const existingVote = await Vote.findOne({
      user: req.user.userId,
      targetId,
      targetType,
    }).setOptions(sessionOption);

    let target;
    if (targetType === VoteTargetType.Question) {
      target = await Question.findById(targetId).setOptions(sessionOption);
    } else {
      target = await Answer.findById(targetId).setOptions(sessionOption);
    }

    if (!target) {
      if (useTransaction && session) { await session.abortTransaction(); session.endSession(); }
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Target not found' });
    }

    const author = await User.findById(target.author).setOptions(sessionOption);
    if (!author) {
      if (useTransaction && session) { await session.abortTransaction(); session.endSession(); }
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Author not found' });
    }

    // Calculate Reputation Change
    const reputationChange = calculateReputationChange(targetType, voteValue, existingVote?.value);

    // Update Vote Document
    if (existingVote) {
      if (existingVote.value === voteValue) {
        await existingVote.deleteOne({ session }); // deleteOne supports session in options object
      } else {
        existingVote.value = voteValue;
        await existingVote.save(sessionOption);
      }
    } else {
      const vote = new Vote({
        user: req.user.userId,
        targetId,
        targetType,
        value: voteValue,
      });
      await vote.save(sessionOption);
    }

    // Update Author Reputation
    author.reputation = (author.reputation || 0) + reputationChange;
    await author.save(sessionOption);

    // Update Target Arrays (Upvotes/Downvotes)
    const t = target as any;
    const userId = req.user.userId;
    const userIdStr = userId.toString();

    // Helper to remove user from array
    const removeUser = (arrName: 'upvotes' | 'downvotes') => {
      t[arrName] = t[arrName].filter((id: any) => id.toString() !== userIdStr);
    };

    if (existingVote) {
      if (existingVote.value === voteValue) {
        // Toggle Off: Remove from current array
        if (voteValue === VoteValue.Upvote) removeUser('upvotes');
        else removeUser('downvotes');
      } else {
        // Flip: Remove from old, Add to new
        if (voteValue === VoteValue.Upvote) {
          removeUser('downvotes');
          t.upvotes.push(userId);
        } else {
          removeUser('upvotes');
          t.downvotes.push(userId);
        }
      }
    } else {
      // New Vote: Add to array
      if (voteValue === VoteValue.Upvote) t.upvotes.push(userId);
      else t.downvotes.push(userId);
    }
    
    await t.save(sessionOption);

    if (useTransaction && session) {
      await session.commitTransaction();
      session.endSession();
    }

    res.json({ message: 'Vote recorded', reputationChange });
  } catch (err: any) {
    if (useTransaction && session) {
      await session.abortTransaction();
      session.endSession();
    }
    console.error('Vote Error:', err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Vote failed: ' + err.message);
  }
};
