import express from 'express';
import connectDB from '@/config/db';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter, questionRouter, answerRouter, commentRouter } from '@/routes';

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/questions', questionRouter);
app.use('/api/answers', answerRouter);
app.use('/api/comments', commentRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
