import { VoteTargetType, VoteValue, ReputationPoints } from '@/enums';

const POINTS_CONFIG = {
  [VoteTargetType.Question]: {
    [VoteValue.Upvote]: ReputationPoints.QuestionUp,
    [VoteValue.Downvote]: ReputationPoints.QuestionDown,
  },
  [VoteTargetType.Answer]: {
    [VoteValue.Upvote]: ReputationPoints.AnswerUp,
    [VoteValue.Downvote]: ReputationPoints.AnswerDown,
  },
};

/**
 * Get points worth for a specific vote on a target
 */
export const getVotePoints = (targetType: VoteTargetType, voteValue: VoteValue): number => {
  return POINTS_CONFIG[targetType][voteValue];
};

/**
 * Calculate reputation change based on vote action
 * @param targetType - Type of target (Question/Answer)
 * @param newVoteValue - The value of the vote being cast (1 or -1)
 * @param existingVoteValue - The value of the previous vote if it exists (1 or -1), or null
 * @returns number - The amount of reputation to add (can be negative)
 */
export const calculateReputationChange = (
  targetType: VoteTargetType,
  newVoteValue: VoteValue,
  existingVoteValue?: VoteValue | null
): number => {
  // Case 1: Toggle Off (Unvote) - if user clicks same vote again
  if (existingVoteValue === newVoteValue) {
    return -getVotePoints(targetType, existingVoteValue);
  }

  // Case 2: Flip Vote (e.g. Up -> Down)
  if (existingVoteValue) {
    const removeOld = -getVotePoints(targetType, existingVoteValue);
    const addNew = getVotePoints(targetType, newVoteValue);
    return removeOld + addNew;
  }

  // Case 3: New Vote
  return getVotePoints(targetType, newVoteValue);
};
