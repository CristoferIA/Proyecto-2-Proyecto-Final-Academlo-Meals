const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const globalErrorHandler = require('../controllers/error.controller');
const { usersRouter } = require('../routes/users.routes');
const AppError = require('../utils/appError');
const initModel = require('./init.model');
const rateLimit = require('express-rate-limit');
const { db } = require('../database/db');
const { restaurantsRouter } = require('../routes/restaurants.routes');
const { mealsRouter } = require('../routes/meals.routes');
const { ordersRouter } = require('../routes/orders.routes');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.limiter = rateLimit({
      max: 100,
      windowMs: 60 * 60 * 1000,
      message: 'Too many request from this IP, please try again in an hour!',
    });
    this.paths = {
      users: '/api/v1/users',
      restaurants: '/api/v1/restaurants',
      meals: '/api/v1/meals',
      orders: '/api/v1/orders',
    };
    this.database();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }
    this.app.use('/api/v1', this.limiter);
    //UTILIZAMOS LAS CORS PARA PERMITIR ACCESSO A LA API
    this.app.use(cors());
    //UTILIZAMOS EXPRESS.JSON PARA PARSEAR EL BODY DE LA REQUEST
    this.app.use(express.json());
  }
  routes() {
    this.app.use(this.paths.users, usersRouter);
    this.app.use(this.paths.restaurants, restaurantsRouter);
    this.app.use(this.paths.meals, mealsRouter);
    this.app.use(this.paths.orders, ordersRouter);

    this.app.all('*', (req, res, next) => {
      return next(
        new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
      );
    });
    this.app.use(globalErrorHandler);
  }
  database() {
    db.authenticate()
      .then(() => console.log('Database authenticated'))
      .catch(error => console.log(error));

    // relations
    initModel();

    db.sync() // {force:true}
      .then(() => console.log('Database synced'))
      .catch(error => console.log(error));
  }
  listen() {
    this.app.listen(this.port, () => {
      console.log('Server is running on port', this.port);
    });
  }
}

module.exports = Server;
