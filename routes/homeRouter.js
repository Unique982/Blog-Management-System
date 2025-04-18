const express = require('express');
const HomeController = require('../controllers/homeController');
const homeRouter = express.Router();

homeRouter.get('/',HomeController.getHome);
homeRouter.get('/home',HomeController.getHomeIndex);
module.exports = homeRouter;