const Restaurants = require('../models/restaurants.model');
const Reviews = require('../models/reviews.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validateNameRestaurantExist = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const restaurant = await Restaurants.findOne({
    where: {
      name: name,
    },
  });
  if (restaurant && !restaurant.status) {
    return next(
      new AppError(
        'The restaurant has an account, but it is deactivated please talk to the administrator to activate it',
        400
      )
    );
  }
  if (restaurant) {
    return next(new AppError('The name restaurant already exists', 400));
  }

  next();
});

exports.validateIdRestaurantExist = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const restaurant = await Restaurants.findOne({
    where: {
      id,
      status: true,
    },
  });
  if (!restaurant) {
    return next(
      new AppError('The restaurant not exists or is deactivated', 404)
    );
  }
  req.restaurant = restaurant;
  next();
});

exports.validateIdReviewsExist = catchAsync(async (req, res, next) => {
  const { restaurantId, id } = req.params;
  const { sessionUser } = req;
  const reviews = await Reviews.findOne({
    where: {
      id,
      restaurantId,
      userId: sessionUser.id,
    },
  });
  if (!reviews) {
    return next(new AppError('The reviews not exists', 404));
  }

  req.reviews = reviews;
  next();
});
