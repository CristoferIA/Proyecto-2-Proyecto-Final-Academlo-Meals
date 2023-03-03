const Meals = require('./meals.model');
const Orders = require('./orders.model');
const Restaurants = require('./restaurants.model');
const Reviews = require('./reviews.model');
const Users = require('./users.model');

const initModel = () => {
  Users.hasMany(Reviews);
  Reviews.belongsTo(Users);

  Restaurants.hasMany(Reviews);
  Reviews.belongsTo(Restaurants);

  Restaurants.hasMany(Meals);
  Meals.belongsTo(Restaurants);

  Meals.hasOne(Orders);
  Orders.belongsTo(Meals);

  Users.hasMany(Orders);
  Orders.belongsTo(Users);
};

module.exports = initModel;
