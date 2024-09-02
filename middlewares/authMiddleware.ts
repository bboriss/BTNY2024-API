/// <reference path="../types/express.d.ts" />

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const secret = process.env.JWT_SECRET || 'my_jwt_secret';

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded: any = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = {
      id: user._id.toString(),
      username: user.username,
      role: user.role as 'admin' | 'user',
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
