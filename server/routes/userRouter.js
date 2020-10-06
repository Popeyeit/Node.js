const express = require('express');
const Joi = require('joi');
const {
  Types: { ObjectId },
} = require('mongoose');
const userRouter = express.Router();
const { handleValidate } = require('../helpers/validate');

const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: 'tmp',
  filename: (req, file, cb) => {
    const { ext } = path.parse(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({
  storage,
});

const {
  registerUser,
  loginUser,
  authorize,
  logoutUser,
  currentUser,
  updateSubscription,
  compressImg,
  checkUniqueEmail,
  updateAvatar,
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
const updateAvatarSchema = Joi.object({
  avatar: Joi.binary().encoding('base64'),
  allow: 'multipart/form-data',
});

userRouter.post(
  '/register',
  upload.single('avatar'),
  handleValidate(registerSchema),
  compressImg,
  checkUniqueEmail,
  registerUser,
);
userRouter.post('/login', handleValidate(loginSchema), loginUser);
userRouter.get('/current', authorize, currentUser);
userRouter.post('/logout', authorize, logoutUser);
userRouter.patch(
  '/update-subscription',
  authorize,
  handleValidate(updateSubscriptionSchema),
  updateSubscription,
);
userRouter.patch(
  '/avatars',
  authorize,
  upload.single('avatar'),
  handleValidate(updateAvatarSchema),
  compressImg,
  updateAvatar,
);

module.exports = userRouter;
