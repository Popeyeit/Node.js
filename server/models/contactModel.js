const fs = require('fs');
const path = require('path');
const contactsPath = path.join(__dirname, '../../db/contacts.json');

function contactIndex(contacts, contactId) {
  return contacts.findIndex(item => String(item.id) === contactId);
}

async function listContacts() {
  try {
    const contacts = await fs.promises.readFile(contactsPath, 'utf-8');
    return JSON.parse(contacts);
  } catch (error) {
    return error;
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();

    return contacts.find(item => {
      return String(item.id) === contactId;
    });
  } catch (error) {}
}

async function removeContact(contactId) {
  try {
    const contacts = await listContacts();

    const idx = contactIndex(contacts, contactId);
    if (idx < 0) {
      return idx;
    }
    const res = contacts.splice(idx, 1);
    await fs.promises.writeFile(contactsPath, JSON.stringify(contacts));
    if (idx >= 0) {
      return idx;
    }
  } catch (error) {
    return error;
  }
}

async function addContact(name, email, phone) {
  try {
    const contacts = await listContacts();
    const obj = {
      name,
      email,
      phone,
      id: Date.now(),
    };

    contacts.push(obj);

    await fs.promises.writeFile(contactsPath, JSON.stringify(contacts));
    return obj;
  } catch (error) {
    return error;
  }
}

async function updateContact({ id, body }) {
  const contacts = await listContacts();
  const idx = contactIndex(contacts, id);
  if (idx < 0) {
    return idx;
  }

  const result = (contacts[idx] = {
    ...contacts[idx],
    ...body,
  });
  await fs.promises.writeFile(contactsPath, JSON.stringify(contacts));
  return result;
}

const invokeAction = function ({ action, id, name, email, phone, body }) {
  switch (action) {
    case 'list':
      return listContacts().then(res => res);

    case 'get':
      return getContactById(id).then(res => res);

    case 'add':
      return addContact(name, email, phone).then(res => res);

    case 'remove':
      return removeContact(id).then(res => res);

    case 'change':
      return updateContact({
        id,
        body,
      }).then(res => res);
    default:
      console.warn('\x1B[31m Unknown action type!');
  }
};

module.exports = invokeAction;
