const { Router } = require('express');
const { check } = require('express-validator');
const {
  createOrder,
  findAllOrderUser,
  updateOrders,
  deleteOrders,
} = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth.middleware');
const {
  validateIdMealExist,
  validateStatusActiveOrden,
} = require('../middlewares/orders.middleware');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = Router();

router.use(protect);
router.post(
  '/',
  [
    check('quantity', 'The quantity must be mandatory').not().isEmpty(),
    check('mealId', 'The mealId must be mandatory').not().isEmpty(),
    validateFields,
    validateIdMealExist,
  ],
  createOrder
);

router.get('/me', findAllOrderUser);

router.patch('/:id', validateStatusActiveOrden, updateOrders);

router.delete('/:id', validateStatusActiveOrden, deleteOrders);

module.exports = {
  ordersRouter: router,
};
