const userModel = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promises: fsPromises } = require('fs');
const path = require('path');
const uuid = require('uuid');
const Jimp = require('jimp');
const sgMail = require('@sendgrid/mail');
const createAvatar = require('../helpers/createAvatar');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = (email, link) => ({
  to: `${email}`,
  from: process.env.EMAIL,
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: `<a href=${link}>link verification</a>`,
});

exports.compressImg = async (req, res, next) => {
  try {
    const { file } = req;
    if (!file) {
      const regFile = await createAvatar();
      req.regFile = regFile;
      const lenna = await Jimp.read(`tmp/${regFile.fileName}`);
      await lenna
        .quality(60)
        .write(path.join(__dirname, '../../public/images/', regFile.fileName));
      await fsPromises.unlink(`tmp/${regFile.fileName}`);
      req.avatarURL = `http://localhost:3000/images/${regFile.fileName}`;
      return next();
    }
    const lenna = await Jimp.read(file.path);
    await lenna
      .quality(60)
      .write(path.join(__dirname, '../../public/images/', file.filename));
    fsPromises.unlink(file.path);
    req.avatarURL = `http://localhost:3000/images/${file.filename}`;
    next();
  } catch (error) {
    next(error);
  }
};

exports.authorize = async (req, res, next) => {
  try {
    const authorizationHeader = req.get('Authorization');
    const token = authorizationHeader.replace('Bearer ', '');

    let userId;
    try {
      userId = await jwt.verify(token, process.env.JWT_SECRET).uid;
    } catch (err) {
      next(err);
    }

    const user = await userModel.findById(userId);

    if (!user || token !== user.token) {
      res.status(401).json('Not authorized');
    }

    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    next(err);
  }
};
const sendVerification = async (email, verificationToken) => {
  const verificationLink = `${process.env.BASE_URL}/auth/verify/${verificationToken}`;
  try {
    const res = await sgMail.send(msg(email, verificationLink));
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};
exports.verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    const user = await userModel.findOne({ verificationToken });

    if (!user) {
      return res.status(404).json('User not found');
    }
    await userModel.findByIdAndUpdate(user.id, {
      verificationToken: '',
    });

    res.status(200).json('Success');
  } catch (error) {
    next(error);
  }
};
exports.registerUser = async (req, res, next) => {
  try {
    const { password } = req.body;
    const hashPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_SALT),
    );
    const user = await userModel.create({
      ...req.body,
      password: hashPassword,
      avatarURL: req.avatarURL,
      verificationToken: uuid.v4(),
    });

    await sendVerification(user.email, user.verificationToken);

    res.status(201).json({
      email: user.email,
      subscription: user.subscription,
      id: user._id,
      avatarURL: user.avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.getUserByEmail(email);
  if (!user) {
    return res.status(401).json('Email or password is wrong');
  }
  const { verificationToken } = user;
  if (verificationToken) {
    return res.status(403).json('Your email is not verified');
  }
  console.log(verificationToken);

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).json('Email or password is wrong');
  }
  const token = await jwt.sign(
    {
      uid: user._id,
    },
    process.env.JWT_SECRET,
  );
  await userModel.updateUserToken(user._id, token);

  res.status(200).json({
    token,
    id: user._id,
    email: user.email,
    subscription: user.subscription,
  });
};
exports.currentUser = async (req, res, next) => {
  try {
    const { token, user } = req;
    res.status(200).json({
      id: user._id,
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
};
exports.logoutUser = async (req, res, next) => {
  try {
    const { user, token } = req;
    await userModel.updateUserToken(user._id, null);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
exports.updateSubscription = async (req, res, next) => {
  try {
    const { user } = req;

    const result = await userModel.findByIdAndUpdate(
      user._id,
      {
        subscription: req.body.subscription,
      },
      {
        new: true,
      },
    );

    res.status(200).json({
      id: result._id,
      email: result.email,
      subscription: result.subscription,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateAvatar = async (req, res, next) => {
  try {
    const { user } = req;
    const { file } = req;
    const result = await userModel.findByIdAndUpdate(
      user._id,
      {
        avatarURL: req.avatarURL,
      },
      {
        new: true,
      },
    );
    if (result) {
      const fileName = path.parse(user.avatarURL).base;
      await fsPromises.unlink(`public/images/${fileName}`);
    }

    res.status(200).json({
      id: result._id,
      email: result.email,
      subscription: result.subscription,
      avatarURL: result.avatarURL,
    });
  } catch (error) {
    next(error);
  }
};

exports.checkUniqueEmail = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { file, regFile } = req;

    const existingUser = await userModel.getUserByEmail(email);

    if (existingUser) {
      if (file) {
        await fsPromises.unlink(`public/images/${file.filename}`);
      }
      if (regFile) {
        await fsPromises.unlink(`public/images/${regFile.fileName}`);
      }

      return res.status(409).json('Email in use');
    }
    next();
  } catch (error) {
    next(error);
  }
};
