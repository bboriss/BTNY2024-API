const express = require('express');
const { getAllTours, getTourById } = require('../controllers/tourController.js');
const { authenticateUser } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.get('/', getAllTours);
router.get('/:id', authenticateUser, getTourById);

module.exports = router;
