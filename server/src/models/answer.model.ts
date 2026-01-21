import mongoose, { Document, Schema } from 'mongoose';

export interface IAnswer extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  questionId: mongoose.Types.ObjectId;
  isAccepted: boolean;
  upvotes: mongoose.Types.ObjectId[];
  downvotes: mongoose.Types.ObjectId[];
}

const AnswerSchema: Schema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
    isAccepted: { type: Boolean, default: false },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);
 
export const Answer = mongoose.model<IAnswer>('Answer', AnswerSchema);
