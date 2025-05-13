const express = require('express');
const HomeController = require('../controllers/homeController');
const homeRouter = express.Router();

homeRouter.get('/',HomeController.getHome);

homeRouter.get("/single/:id",HomeController.singlePost);

module.exports = homeRouter;