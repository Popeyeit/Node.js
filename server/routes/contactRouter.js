const express = require('express');
const contactRouters = express.Router();
const { handleValidate } = require('../helpers/validate');
const {
  createContact,
  getContacts,
  getContactById,
  changeContact,
  deleteContact,
} = require('../controllers/contactControllers');
const {
  rulesCreateContact,
  validateUpdateContact,
  contactIdSchema,
} = require('../Schemes/contactShemes');
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
