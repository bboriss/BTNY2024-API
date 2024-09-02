import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const secret = process.env.JWT_SECRET || 'my_jwt_secret';
const refreshSecret = process.env.JWT_REFRESH_SECRET || 'my_refresh_jwt_secret';

const createToken = (id: string, expiresIn: string) => {
  return jwt.sign({ id }, secret, { expiresIn });
};

const createRefreshToken = (id: string) => {
  return jwt.sign({ id }, refreshSecret, { expiresIn: '7d' });
};

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, username, email, password, role } = req.body;
  try {
    const newUser = new User({ firstName, lastName, username, email, password, role });
    await newUser.save();

    const userId = newUser._id;

    const token = createToken(userId, '1h');
    const refreshToken = createRefreshToken(userId);

    const userData = {
      id: newUser._id,
      username: newUser.username,
      role: newUser.role,
    };

    res.status(201).json({ token, refreshToken, user: userData });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const userId = user._id;

    const token = createToken(userId, '1h');
    const refreshToken = createRefreshToken(userId);

    const userData = {
      id: user._id,
      username: user.username,
      role: user.role,
    };

    res.status(200).json({ token, refreshToken, user: userData });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ message: 'Refresh token not provided' });
  }

  try {
    const decoded: any = jwt.verify(refreshToken, refreshSecret);
    const userId = decoded.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const newToken = createToken(userId, '1h');
    const newRefreshToken = createRefreshToken(userId);

    const userData = {
      id: user._id,
      username: user.username,
      role: user.role,
    };

    res.status(200).json({ token: newToken, refreshToken: newRefreshToken, user: userData });
  } catch (error) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};
