const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Customer Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Customer Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      default: '+91 98765 43210'
    },
    address: {
      type: String,
      default: 'Mumbai, MH'
    },
    city: {
      type: String,
      default: 'Mumbai, MH'
    },
    ordersCount: {
      type: Number,
      default: 0
    },
    totalSpent: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Customer', customerSchema);
