import mongoose, { Document, Schema } from 'mongoose';
import { VoteTargetType } from '@/enums';

export interface IComment extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  targetId: mongoose.Types.ObjectId;
  targetType: VoteTargetType;
}

const CommentSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'targetType' },
    targetType: { type: String, required: true, enum: Object.values(VoteTargetType) },
  },
  { timestamps: true }
);

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);
