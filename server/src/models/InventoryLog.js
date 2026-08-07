const mongoose = require('mongoose');

const inventoryLogSchema = new mongoose.Schema(
  {
    product: {
      type: String,
      required: true
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    oldStock: {
      type: Number,
      required: true
    },
    newStock: {
      type: Number,
      required: true
    },
    change: {
      type: String,
      required: true
    },
    reason: {
      type: String,
      default: 'Stock Adjustment Audit'
    },
    date: {
      type: String,
      default: () => new Date().toISOString().replace('T', ' ').substring(0, 16)
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('InventoryLog', inventoryLogSchema);
