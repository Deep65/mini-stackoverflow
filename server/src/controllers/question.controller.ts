import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Question, Tag } from '@/models';
import { AuthRequest } from '@/types';

export const createQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, tags } = req.body;

    const question = new Question({
      title,
      content,
      tags,
      author: req.user.userId,
    });
    await question.save();

    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        await Tag.findOneAndUpdate({ name: tagName }, { $inc: { count: 1 } }, { upsert: true });
      }
    }

    res.json(question);
  } catch (err: any) {
    console.error(err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
  }
};

export const getQuestions = async (req: Request, res: Response) => {
  try {
    const { search, tag, author } = req.query;
    let query: any = {};

    if (search) {
      query.$text = { $search: search as string };
    }
    if (tag) {
      query.tags = tag;
    }
    if (author) {
      query.author = author;
    }

    const questions = await Question.find(query)
      .populate('author', 'username reputation')
      .populate({ path: 'answers', select: '_id' })
      .sort({ createdAt: -1 });

    res.json(questions);
  } catch (err: any) {
    console.error(err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
  }
};

export const getQuestionById = async (req: Request, res: Response) => {
  try {
    const question = await Question.findById(req.params?.id)
      .populate('author', 'username reputation')
      .populate({
        path: 'answers',
        populate: { path: 'author', select: 'username reputation' },
      });

    if (!question) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Question not found' });
    }

    res.json(question);
  } catch (err: any) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Question not found' });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
  }
};
