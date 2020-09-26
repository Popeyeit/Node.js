const express = require('express');
const Joi = require('joi');
const {
  Types: { ObjectId },
} = require('mongoose');
const userRouter = express.Router();
const { handleValidate } = require('../helpers/validate');
// const {
//     promises: fsPromises
// } = require('fs')
const path = require('path');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
const {
  registerUser,
  loginUser,
  authorize,
  logoutUser,
  currentUser,
  updateSubscription,
} = require('../controllers/userControllers');
const registerSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  subscription: Joi.string().allow('pro', 'free', 'premium').only(),
});
const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string().allow('pro', 'free', 'premium').only(),
});

userRouter.post('/register', handleValidate(registerSchema), registerUser);
userRouter.post('/login', handleValidate(loginSchema), loginUser);
userRouter.get('/current', authorize, currentUser);
userRouter.post('/logout', authorize, logoutUser);
userRouter.patch(
  '/update-subscription',
  handleValidate(updateSubscriptionSchema),
  authorize,
  updateSubscription,
);

module.exports = userRouter;
