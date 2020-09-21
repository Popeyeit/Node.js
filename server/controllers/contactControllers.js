const ContactModel = require('../models/contactModel');

async function createContact(req, res, next) {
  try {
    const uniqueEmail = await ContactModel.findOne({ email: req.body.email });
    if (uniqueEmail) {
      return res.status(409).json('Contact with such email already exists');
    }
    const result = await ContactModel.create(req.body);
    if (result) {
      res.status(201).json(result);
    }
  } catch (error) {
    delete error.stack;
    next(error);
  }
}

async function getContacts(req, res, next) {
  try {
    const result = await ContactModel.find();
    res.status(200).json(result);
  } catch (error) {
    delete error.stack;
    next(error);
  }
}

async function getContactById(req, res, next) {
  try {
    const { contactId } = req.params;
    const result = await ContactModel.findById(contactId);
    if (!result) {
      return res.status(404).json({
        message: 'Not found',
      });
    }

    res.status(200).send(result);
  } catch (error) {
    delete error.stack;
    next(error);
  }
}

async function changeContact(req, res, next) {
  try {
    const { contactId } = req.params;
    if (!Object.keys(req.body).length) {
      res.status(400).json({
        message: 'missing fields',
      });
      return;
    }
    const result = await ContactModel.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });

    if (result !== -1) {
      res.status(200).json(result);
    }
    if (result < 0) {
      res.status(404).json({
        message: 'Not found',
      });
    }
  } catch (error) {
    delete error.stack;
    next(error);
  }
}

async function deleteContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const result = await ContactModel.findByIdAndDelete(contactId);

    if (result >= 0) {
      res.status(200).json({
        message: 'contact deleted',
      });
    }
    if (result < 0) {
      res.status(404).json({
        message: 'Not found',
      });
    }
  } catch (error) {
    delete error.stack;
    next(error);
  }
}
module.exports = {
  createContact,
  getContacts,
  getContactById,
  changeContact,
  deleteContact,
};
