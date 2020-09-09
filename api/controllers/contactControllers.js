const invokeAction = require('../models/contactModel');
async function createContact(req, res, next) {
  const result = await invokeAction({
    action: 'add',
    ...req.body,
  });
  if (result) {
    res.status(201).json(result);
  }
}
async function getContacts(req, res, next) {
  const result = await invokeAction({
    action: 'list',
  });
  res.status(200).json(result);
}
async function getContactById(req, res, next) {
  const { contactId } = req.params;
  const result = await invokeAction({
    action: 'get',
    id: contactId,
  });
  if (!result) {
    res.status(404).json({ message: 'Not found' });
  }

  res.status(200).send(result);
}

async function changeContact(req, res, next) {
  const { contactId } = req.params;
  if (!Object.keys(req.body).length) {
    res.status(400).json({
      message: 'missing fields',
    });
    return;
  }
  const result = await invokeAction({
    action: 'change',
    id: contactId,
    body: req.body,
  });

  if (result !== -1) {
    res.status(200).json(result);
  }
  if (result < 0) {
    res.status(404).json({
      message: 'Not found',
    });
  }
}

async function deleteContact(req, res, next) {
  const { contactId } = req.params;
  const result = await invokeAction({
    action: 'remove',
    id: contactId,
  });

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
}
module.exports = {
  createContact,
  getContacts,
  getContactById,
  changeContact,
  deleteContact,
};
