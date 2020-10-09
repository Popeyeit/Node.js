const express = require('express');
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
  verifyEmail,
} = require('../controllers/userControllers');
const {
  registerSchema,
  loginSchema,
  updateSubscriptionSchema,
  updateAvatarSchema,
} = require('../Schemes/userSchemes');
userRouter.post(
  '/register',
  upload.single('avatar'),
  handleValidate(registerSchema),
  compressImg,
  checkUniqueEmail,
  registerUser,
);
userRouter.get('/verify/:verificationToken', verifyEmail);
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
