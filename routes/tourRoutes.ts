import express from 'express';
import { getAllTours, getTourById } from '../controllers/tourController';
import { authenticateUser } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', getAllTours);
router.get('/:id', authenticateUser, getTourById);

export default router;
