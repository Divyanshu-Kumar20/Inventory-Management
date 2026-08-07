const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Supplier Name is required'],
      trim: true
    },
    contactPerson: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      required: [true, 'Supplier Email is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Supplier Phone is required']
    },
    address: {
      type: String,
      default: ''
    },
    productsSupplied: {
      type: Number,
      default: 0
    },
    rating: {
      type: Number,
      default: 4.8
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Supplier', supplierSchema);
