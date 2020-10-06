const mongoose = require('mongoose');
const { Schema } = mongoose;
const { updateUserToken, getUserByEmail } = require('../services/userServices');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  subscription: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free',
  },
  token: {
    type: String,
    required: false,
  },
  avatarURL: String,
});

userSchema.statics.getUserByEmail = getUserByEmail;
userSchema.statics.updateUserToken = updateUserToken;

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
