const express = require("express");
const visitorRouter = express.Router();
const VisitorController = require("../controllers/backend/visitorController")

visitorRouter.get('/visitor/list',VisitorController.getVisitorList);

module.exports = visitorRouter;
