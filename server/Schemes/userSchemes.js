const Joi = require('joi');

exports.registerSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
  subscription: Joi.string().allow('pro', 'free', 'premium').only(),
});
exports.loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
exports.updateSubscriptionSchema = Joi.object({
  subscription: Joi.string().allow('pro', 'free', 'premium').only(),
});
exports.updateAvatarSchema = Joi.object({
  avatar: Joi.binary().encoding('base64'),
  allow: 'multipart/form-data',
});
