const mongoose = require('mongoose');
const { Schema } = mongoose;
const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    unique: true,
    indexes: true,
  },
  subscription: {
    type: String,
    required: true,
  },
});
const ContactModel = mongoose.model('Contact', contactSchema);
module.exports = ContactModel;
