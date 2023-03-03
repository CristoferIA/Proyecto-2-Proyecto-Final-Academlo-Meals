const Meals = require('../models/meals.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validateIdMealsExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const meals = await Meals.findOne({
    where: {
      id,
    },
  });

  if (!meals) {
    return next(new AppError('The meals not exists or is deactivated', 404));
  }
  req.meals = meals;
  next();
});
