const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    rendomtoken: {
      type: String,
      default: null,
    },
    membershipID: {
      type: String,
      default: '0',
    },
    city: {
      type: String,
      default: '',
    },
    DOB: {
      type: String,
    },
    DOM: {
      type: String,
    },
    spouseName: {
      type: String,
      default: '',
    },
    isAdmin:{
      type: Boolean,
      default: false,
    },
    classification: {
      type: String,
      default: '',
    },
    designation: {
      type: String,
      default: '',
    },
    committee: {
      type: String,
      default: '',
    },
    occupation: {
      type: String,
      default: '',
    },
    businessName: {
      type: String,
      default: '',
    },
    businessAddress: {
      type: String,
      default: '',
    },
    businessPhone: {
      type: String,
    },
    businessEmail: {
      type: String,
    },
    userPhoto: {
      type: String,
      // required: true,
    },
    spousePhoto: {
      type: String,
    }, 
    status: {
      type: String,
      default: 'Active',
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    clubName: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
module.exports=User;