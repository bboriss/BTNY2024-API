import { User as UserType } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        role: 'admin' | 'user';
      };
    }
  }
}
