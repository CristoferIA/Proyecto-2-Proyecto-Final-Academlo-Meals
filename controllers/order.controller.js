const Meals = require('../models/meals.model');
const Orders = require('../models/orders.model');
const Restaurants = require('../models/restaurants.model');
const catchAsync = require('../utils/catchAsync');

exports.createOrder = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const { meals } = req;
  const { quantity, mealId } = req.body;
  const totalPrice = meals.price * parseInt(quantity);
  const createOrder = await Orders.create({
    mealId,
    userId: sessionUser.id,
    totalPrice,
    quantity,
  });

  res.status(201).json({
    status: 'success',
    message: 'Then order has been created successfully',
    createOrder,
  });
});

exports.findAllOrderUser = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const findAllOrders = await Orders.findAll({
    where: {
      userId: sessionUser.id,
    },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
    include: [
      {
        model: Meals,
        attributes: { exclude: ['createdAt', 'updatedAt', 'status'] },
        include: [
          {
            model: Restaurants,
            attributes: { exclude: ['createdAt', 'updatedAt', 'status'] },
          },
        ],
      },
    ],
  });

  if (!findAllOrders) {
    next(new AppError('Orders not found', 404));
  }
  res.status(200).json({
    status: 'success',
    findAllOrders,
  });
});

exports.updateOrders = catchAsync(async (req, res, next) => {
  const { order } = req;
  const updateOrder = await order.update({ status: 'completed' });
  res.status(200).json({
    status: 'success',
    message: 'Order updated successfully',
    updateOrder,
  });
});

exports.deleteOrders = catchAsync(async (req, res, next) => {
  const { order } = req;
  await order.update({ status: 'cancelled' });
  res.status(200).json({
    status: 'success',
    message: 'Order deleted successfully',
  });
});
