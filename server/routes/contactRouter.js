const express = require('express');
const Joi = require('joi');
const {
  Types: { ObjectId },
} = require('mongoose');
const contactRouters = express.Router();

const { handleValidate } = require('../helpers/validate');
const {
  createContact,
  getContacts,
  getContactById,
  changeContact,
  deleteContact,
} = require('../controllers/contactControllers');
const rulesCreateContact = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  subscription: Joi.string().required(),
  password: Joi.string().required(),
  token: Joi.string().required(),
});

const validateUpdateContact = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  subscription: Joi.string(),
  password: Joi.string(),
  token: Joi.string(),
});

const contactIdSchema = Joi.object({
  contactId: Joi.string().custom((value, helpers) => {
    const isValidObjId = ObjectId.isValid(value);
    if (!isValidObjId) {
      return helpers.error('Invalid contact id. Must be object id');
    }
    return value;
  }),
});

contactRouters.post('/', handleValidate(rulesCreateContact), createContact);
contactRouters.get('/', getContacts);
contactRouters.get(
  '/:contactId',
  handleValidate(contactIdSchema, 'params'),
  getContactById,
);
contactRouters.patch(
  '/:contactId',
  handleValidate(contactIdSchema, 'params'),
  handleValidate(validateUpdateContact),
  changeContact,
);
contactRouters.delete(
  '/:contactId',
  handleValidate(contactIdSchema, 'params'),
  deleteContact,
);

module.exports = contactRouters;
