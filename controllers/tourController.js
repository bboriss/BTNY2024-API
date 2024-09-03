const Tour = require('../models/Tour.js');

const getAllTours = async (req, res) => {
  try {
    const { search, sort, page = '1', limit = '5' } = req.query;

    let query = {};

    if (search) {
      query['start station name'] = { $regex: search, $options: 'i' };
    }

    let sortOption = {};
    if (sort === 'shortest') {
      sortOption.tripduration = 1;
    } else if (sort === 'longest') {
      sortOption.tripduration = -1;
    }

    const currentPage = parseInt(page, 10) || 1;
    const perPage = parseInt(limit, 10) || 5;

    const skip = (currentPage - 1) * perPage;

    const tours = await Tour.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(perPage);

    const totalTours = await Tour.countDocuments(query);
    
    res.status(200).json({
      tours,
      totalTours,
      currentPage,
      totalPages: Math.ceil(totalTours / perPage),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getTourById = async (req, res) => {
  try {
    const { id } = req.params;

    const tour = await Tour.findById(id);

    if (!tour) {
      return res.status(404).json({ message: 'Tour not found' });
    }

    res.status(200).json(tour);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  getAllTours,
  getTourById
};
