const {
  Types: { ObjectId },
} = require('mongoose');
const Joi = require('joi');
exports.rulesCreateContact = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  subscription: Joi.string().required(),
  password: Joi.string().required(),
  token: Joi.string().required(),
});

exports.validateUpdateContact = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  subscription: Joi.string(),
  password: Joi.string(),
  token: Joi.string(),
});

exports.contactIdSchema = Joi.object({
  contactId: Joi.string().custom((value, helpers) => {
    const isValidObjId = ObjectId.isValid(value);
    if (!isValidObjId) {
      return helpers.error('Invalid contact id. Must be object id');
    }
    return value;
  }),
});
