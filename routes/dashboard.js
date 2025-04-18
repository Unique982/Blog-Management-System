const express = require('express');
 const DashboardController = require('../controllers/backend/dashboardController');
 const userMiddlewares = require('../middlewares/authentication');
 const dashboardRouter = express.Router();

 dashboardRouter.get('/dashboard',userMiddlewares('token'),DashboardController.getHome);

module.exports = dashboardRouter;