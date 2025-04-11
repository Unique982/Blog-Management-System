const express = require('express');
const authRouter = express.Router();
const authController = require('../controllers/authController');

authRouter.get("/login",authController.getLogin);
authRouter.post("/login",authController.postLogin);
authRouter.post("/signup",authController.postSignup);
authRouter.get("/signup",authController.getSignup);
authRouter.post("/logout",authController.getLogout);

module.exports = authRouter;
