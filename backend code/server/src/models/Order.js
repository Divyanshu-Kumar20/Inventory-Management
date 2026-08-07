const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: String,
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true
    },
    customer: {
      type: String,
      required: [true, 'Customer name is required']
    },
    customerEmail: {
      type: String,
      required: [true, 'Customer email is required']
    },
    items: [orderItemSchema],
    amount: {
      type: Number,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: ['Credit Card', 'Wire Transfer', 'UPI / NetBanking', 'PayPal', 'Cash on Delivery'],
      default: 'Credit Card'
    },
    paymentStatus: {
      type: String,
      enum: ['Paid', 'Pending', 'Failed'],
      default: 'Paid'
    },
    fulfillmentStatus: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'],
      default: 'Pending'
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate invoice number before save
orderSchema.pre('save', function (next) {
  if (!this.invoiceNumber) {
    this.invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
