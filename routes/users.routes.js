const { Router } = require('express');
const { check } = require('express-validator');
const {
  createUser,
  login,
  updateUser,
  deleteUser,
  findAllOrders,
  findOneOrders,
} = require('../controllers/users.controller');
const {
  protectAccountOwner,
  protect,
} = require('../middlewares/auth.middleware');
const {
  validExistUserEmail,
  validIfExistUser,
} = require('../middlewares/users.middleware');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = Router();

router.post(
  '/signup',
  [
    check('name', 'The username must be mandatory').not().isEmpty(),
    check('email', 'The email must be mandatory').not().isEmpty(),
    check('email', 'The email must be a correct format').isEmail(),
    check('password', 'The password must be mandatory').not().isEmpty(),
    check('role', 'The password must be mandatory').not().isEmpty(),
    validateFields,
    validExistUserEmail,
  ],
  createUser
);

router.post(
  '/login',
  [
    check('email', 'The email must be mandatory').not().isEmpty(),
    check('email', 'The email must be a correct format').isEmail(),
    check('password', 'The password must be mandatory').not().isEmpty(),
    validateFields,
  ],
  login
);

router.use(protect);
router.patch(
  '/:id',
  [
    check('name', 'The username must be mandatory').not().isEmpty(),
    check('email', 'The email must be mandatory').not().isEmpty(),
    check('email', 'The email must be a correct format').isEmail(),
    validateFields,
    validIfExistUser,
    protectAccountOwner,
  ],
  updateUser
);

router.delete('/:id', validIfExistUser, protectAccountOwner, deleteUser);

router.get('/orders', findAllOrders);
router.get('/order/:id', findOneOrders);

module.exports = {
  usersRouter: router,
};
