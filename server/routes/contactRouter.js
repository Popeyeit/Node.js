const express = require('express');
const Joi = require('joi');
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
});

const validateUpdateContact = Joi.object({
  name: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
});

contactRouters.post('/', handleValidate(rulesCreateContact), createContact);
contactRouters.get('/', getContacts);
contactRouters.get('/:contactId', getContactById);
contactRouters.patch(
  '/:contactId',
  handleValidate(validateUpdateContact),
  changeContact,
);
contactRouters.delete('/:contactId', deleteContact);

module.exports = contactRouters;
