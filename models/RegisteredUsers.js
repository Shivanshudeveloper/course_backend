const mongoose = require('mongoose');

const registeredUserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  institutionName: {
    type: String,
    required: false,
  },
  packagePlan: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  paymentInformation: {
    type: Object,
    required: true,
  },
  ambasadorId: {
    type: String,
    required: false,
  },
  referalCode: {
    type: String,
    required: false,
  },
  ccsmode: {
    type: String,
    required: false,
  },
  dsamode: {
    type: String,
    required: false,
  },
  mlmode: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const registeredUser = mongoose.model('registered_users', registeredUserSchema);
module.exports = registeredUser;
