const { Router } = require('express');
const { check } = require('express-validator');
const {
  createMeals,
  updateMeals,
  deleteMeals,
  findAllMeals,
  findOneMeals,
} = require('../controllers/meals.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const { validateIdMealsExist } = require('../middlewares/meals.middleware');
const {
  validateIdRestaurantExist,
} = require('../middlewares/restaurants.middleware');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = Router();

router.get('/', findAllMeals);
router.get('/:id', findOneMeals);

router.use(protect);
router.post(
  '/:id',
  [
    check('name', 'The name must be mandatory').not().isEmpty(),
    check('price', 'The price must be mandatory').not().isEmpty(),
    validateFields,
    restrictTo('admin'),
    validateIdRestaurantExist,
  ],
  createMeals
);

router.patch(
  '/:id',
  [
    check('name', 'The name must be mandatory').not().isEmpty(),
    check('price', 'The price must be mandatory').not().isEmpty(),
    validateFields,
    restrictTo('admin'),
    validateIdMealsExist,
  ],
  updateMeals
);

router.delete('/:id', restrictTo('admin'), validateIdMealsExist, deleteMeals);

module.exports = {
  mealsRouter: router,
};
