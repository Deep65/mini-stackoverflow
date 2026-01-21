import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { User } from '@/models';
import { AuthRequest } from '@/types';
import { hashPassword, comparePassword } from '@/utils';

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'User already exists' });
    }

    const hashedPassword = await hashPassword(password);

    user = new User({ username, email, password: hashedPassword });
    await user.save();

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '5h' });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        reputation: user.reputation,
      },
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid credentials' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid credentials' });
    }

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '5h' });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        reputation: user.reputation,
      },
    });
  } catch (err: any) {
    console.error(err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
  }
};

export const getProfileDetails = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (err: any) {
    console.error(err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
  }
};
