import mongoose, { Document, Schema } from 'mongoose';

export interface ITag extends Document {
  name: string;
  count: number;
}

const TagSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  count: { type: Number, default: 0 },
});

export const Tag = mongoose.model<ITag>('Tag', TagSchema);
