import mongoose, { Document, Schema } from 'mongoose';
import { VoteTargetType, VoteValue } from '@/enums';

export interface IVote extends Document {
  user: mongoose.Types.ObjectId;
  targetId: mongoose.Types.ObjectId;
  targetType: VoteTargetType;
  value: VoteValue;
}

const VoteSchema: Schema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'targetType' },
    targetType: {
      type: String,
      required: true,
      enum: Object.values(VoteTargetType),
    },
    value: { type: Number, required: true, enum: Object.values(VoteValue).filter((v) => typeof v === 'number') },
  },
  { timestamps: true }
);

VoteSchema.index({ user: 1, targetId: 1, targetType: 1 }, { unique: true });

export const Vote = mongoose.model<IVote>('Vote', VoteSchema);
