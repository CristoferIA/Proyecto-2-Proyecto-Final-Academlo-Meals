const Users = require('../models/users.model');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/jwt');
const AppError = require('../utils/appError');
const Orders = require('../models/orders.model');
const Meals = require('../models/meals.model');
const Restaurants = require('../models/restaurants.model');

/* A function that creates a user. */
exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, role = 'normal' } = req.body;
  console.log(name);
  const passwordChangedAt = new Date();
  const user = new Users({ name, email, password, passwordChangedAt, role });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  await user.save();

  const token = await generateJWT(user.id);
  res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    token,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

/* A function that is used to login a user. */
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await Users.findOne({
    where: {
      email: email.toLowerCase(),
      status: true,
    },
  });

  if (!user) {
    return next(new AppError('The user could not be found', 404));
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = await generateJWT(user.id);

  res.status(200).json({
    status: 'success',
    token,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;
  const { user } = req;

  await user.update({ name, email });

  res.status(200).json({
    status: 'success',
    message: 'User updated successfully',
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: false });

  res.status(200).json({
    status: 'success',
    message: 'User deleted successfully',
  });
});

exports.findAllOrders = catchAsync(async (req, res, next) => {
  const { sessionUser } = req;
  const orders = await Orders.findAll({
    where: {
      userId: sessionUser.id,
      status: 'completed',
    },
    include: [
      {
        model: Meals,
        attributes: { exclude: ['createdAt', 'updatedAt', 'status'] },
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
      },
    ],
  });

  if (!orders) {
    return next(new AppError('Orders not found', 404));
  }

  res.status(200).json({
    status: 'success',
    orders,
  });
});

exports.findOneOrders = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { sessionUser } = req;

  const order = await Orders.findOne({
    where: {
      id,
      userId: sessionUser.id,
    },
    include: [
      {
        model: Meals,
        attributes: { exclude: ['createdAt', 'updatedAt', 'status'] },
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
      },
    ],
  });

  if (!order) {
    return next(new AppError('Orders not found', 404));
  }

  res.status(200).json({
    status: 'success',
    order,
  });
});
