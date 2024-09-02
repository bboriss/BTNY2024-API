import express, { Request, Response, NextFunction } from 'express';
import authRoutes from './routes/authRoutes';
import tourRoutes from './routes/tourRoutes';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import morgan from 'morgan';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000' }));
app.use(helmet());
app.use(morgan('tiny'));

app.use('/public', express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tours', tourRoutes);

app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    message: 'Custom Not Found',
  });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong! Please try again later.',
  });
});

mongoose.connect(process.env.MONGO_URI!, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as mongoose.ConnectOptions)
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})
.catch((error) => {
  console.error('Database connection error:', error);
});
