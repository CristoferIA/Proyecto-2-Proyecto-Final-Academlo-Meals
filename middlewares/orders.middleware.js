const Meals = require('../models/meals.model');
const Orders = require('../models/orders.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.validateIdMealExist = catchAsync(async (req, res, next) => {
  const { mealId } = req.body;
  const meals = await Meals.findOne({
    where: {
      id: mealId,
      status: true,
    },
  });

  if (!meals) {
    return next(new AppError('The meals not exists or is deactivated', 404));
  }
  req.meals = meals;
  next();
});

exports.validateStatusActiveOrden = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { sessionUser } = req;
  const order = await Orders.findOne({
    where: {
      id,
      userId: sessionUser.id,
      status: 'active',
    },
  });
  if (!order) {
    return next(
      new AppError('The order not exists or is no longer active', 404)
    );
  }
  req.order = order;
  next();
});
