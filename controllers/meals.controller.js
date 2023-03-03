const Meals = require('../models/meals.model');
const Restaurants = require('../models/restaurants.model');
const catchAsync = require('../utils/catchAsync');

exports.createMeals = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  const { restaurant } = req;
  const createdMeals = await Meals.create({
    name,
    price,
    restaurantId: restaurant.id,
  });
  res.status(200).json({
    status: 'success',
    message: 'The Meals was created successfully',
    createdMeals,
  });
});

exports.updateMeals = catchAsync(async (req, res, next) => {
  const { name, price } = req.body;
  const { meals } = req;
  const updateMeals = await meals.update({
    name,
    price,
  });
  res.status(200).json({
    status: 'success',
    message: 'The Meals was updated successfully',
    updateMeals,
  });
});

exports.deleteMeals = catchAsync(async (req, res, next) => {
  const { meals } = req;
  await meals.update({
    status: false,
  });
  res.status(200).json({
    status: 'success',
    message: 'The Meals was deleted successfully',
  });
});

exports.findAllMeals = catchAsync(async (req, res, next) => {
  const meals = await Meals.findAll({
    where: {
      status: true,
    },
    include: [
      {
        model: Restaurants,
        attributes: { exclude: ['createdAt', 'updatedAt', 'status'] },
        where: {
          status: true,
        },
      },
    ],
  });

  if (!meals) {
    next(new AppError('Meals not found', 404));
  }
  res.status(200).json({
    status: 'success',
    meals,
  });
});

exports.findOneMeals = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const meals = await Meals.findOne({
    where: {
      id,
      status: true,
    },
    include: [
      {
        model: Restaurants,
        attributes: { exclude: ['createdAt', 'updatedAt', 'status'] },
        where: {
          status: true,
        },
      },
    ],
  });

  if (!meals) {
    next(new AppError('Meals not found', 404));
  }
  res.status(200).json({
    status: 'success',
    meals,
  });
});
