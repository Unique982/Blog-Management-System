const express = require('express');
 const DashboardController = require('../controllers/backend/dashboardController');
 const dashboardRouter = express.Router();

 dashboardRouter.get('/dashboard',DashboardController.getHome);

module.exports = dashboardRouter;