const Users = require('../models/users.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

/* A middleware that validates if the user exists in the database. */
exports.validExistUserEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await Users.findOne({
    where: {
      email: email.toLowerCase(),
    },
  });

  if (user && !user.status) {
    return next(
      new AppError(
        'The user has an account, but it is deactivated please talk to the administrator to activate it',
        400
      )
    );
  }

  if (user) {
    return next(new AppError('The email user already exists', 400));
  }

  next();
});

/* A middleware that validates if the user exists in the database. */
exports.validIfExistUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const user = await Users.findOne({
    where: {
      status: true,
      id,
    },
  });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  req.user = user;
  next();
});
