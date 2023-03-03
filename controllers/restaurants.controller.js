const Restaurants = require('../models/restaurants.model');
const Reviews = require('../models/reviews.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createRestaurant = catchAsync(async (req, res, next) => {
  const { name, address, rating } = req.body;
  const restaurant = await Restaurants.create({
    name,
    address,
    rating,
  });
  res.status(201).json({
    status: 'success',
    message: 'The restaurant was created successfully',
    restaurant,
  });
});

exports.updateRestaurant = catchAsync(async (req, res, next) => {
  const { name, address } = req.body;
  const { restaurant } = req;
  const updateRestaurant = await restaurant.update({ name, address });
  res.status(200).json({
    status: 'success',
    message: 'Then restaurant has been updated successfully',
    updateRestaurant,
  });
});

exports.deleteRestaurant = catchAsync(async (req, res, next) => {
  const { restaurant } = req;
  const updateRestaurant = await restaurant.update({ status: false });
  res.status(200).json({
    status: 'success',
    message: 'Then restaurant has been deleted successfully',
  });
});

exports.createReviews = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { id } = req.params;
  const { comment, rating } = req.body;

  const createReview = await Reviews.create({
    userId: sessionUser.id,
    comment,
    rating,
    restaurantId: id,
  });
  res.status(200).json({
    status: 'success',
    message: 'Then review has been created successfully',
    createReview,
  });
});

exports.updateReviews = catchAsync(async (req, res, next) => {
  const { comment, rating } = req.body;
  const { reviews } = req;

  const updateReview = await reviews.update({
    comment,
    rating,
  });
  res.status(200).json({
    status: 'success',
    message: 'Then review has been updated successfully',
    updateReview,
  });
});

exports.deleteReviews = catchAsync(async (req, res, next) => {
  const { reviews } = req;
  await reviews.update({
    status: false,
  });
  res.status(200).json({
    status: 'success',
    message: 'Then review has been deleted successfully',
  });
});

exports.findAllRestaurants = catchAsync(async (req, res, next) => {
  const restaurants = await Restaurants.findAll({
    where: {
      status: true,
    },
    include: [
      {
        model: Reviews,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    ],
  });

  if (!restaurants) {
    next(new AppError('Restaurant not found', 404));
  }

  res.status(200).json({
    status: 'success',
    restaurants,
  });
});

exports.findOneRestaurants = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const restaurant = await Restaurants.findOne({
    where: {
      id,
      status: true,
    },
    include: [
      {
        model: Reviews,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
      },
    ],
  });

  if (!restaurant) {
    next(new AppError('Restaurant not found', 404));
  }

  res.status(200).json({
    status: 'success',
    restaurant,
  });
});
