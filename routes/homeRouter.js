const express = require('express');
const HomeController = require('../controllers/homeController');
const homeRouter = express.Router();

homeRouter.get('/',HomeController.getHome);

module.exports = homeRouter;