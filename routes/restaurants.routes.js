const { Router } = require('express');
const { check } = require('express-validator');
const {
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  createReviews,
  updateReviews,
  deleteReviews,
  findAllRestaurants,
  findOneRestaurants,
} = require('../controllers/restaurants.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const {
  validateNameRestaurantExist,
  validateIdRestaurantExist,
  validateIdReviewsExist,
} = require('../middlewares/restaurants.middleware');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = Router();

router.get('/', findAllRestaurants);
router.get('/:id', findOneRestaurants);

router.use(protect);
router.post(
  '/',
  [
    check('name', 'The name must be mandatory').not().isEmpty(),
    check('address', 'The address must be mandatory').not().isEmpty(),
    check('rating', 'The rating must be a correct format').not().isEmpty(),
    validateFields,
    restrictTo('admin'),
    validateNameRestaurantExist,
  ],
  createRestaurant
);

router.patch(
  '/:id',
  [
    check('name', 'The name must be mandatory').not().isEmpty(),
    check('address', 'The address must be mandatory').not().isEmpty(),
    validateFields,
    restrictTo('admin'),
    validateIdRestaurantExist,
  ],
  updateRestaurant
);

router.delete(
  '/:id',
  restrictTo('admin'),
  validateIdRestaurantExist,
  deleteRestaurant
);

router.post(
  '/reviews/:id',
  [
    check('comment', 'The comment must be mandatory').not().isEmpty(),
    check('rating', 'The rating must be mandatory').not().isEmpty(),
    validateFields,
    restrictTo('admin'),
    validateIdRestaurantExist,
  ],
  createReviews
);

router.patch(
  '/reviews/:restaurantId/:id',
  [
    check('comment', 'The comment must be mandatory').not().isEmpty(),
    check('rating', 'The rating must be mandatory').not().isEmpty(),
    validateFields,
    restrictTo('admin'),
    validateIdReviewsExist,
  ],
  updateReviews
);

router.delete(
  '/reviews/:restaurantId/:id',
  validateIdReviewsExist,
  deleteReviews
);

module.exports = {
  restaurantsRouter: router,
};
