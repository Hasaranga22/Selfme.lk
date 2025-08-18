const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    serial_number: {
      type: String,
      required: true,
    },
    item_name: {
      type: String,
      required: true,
    },
    item_image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    quantity_in_stock: {
      type: Number,
      required: true,
    },
    supplier_id: {
      type: String,
      required: true,
    },

    min_stock_level: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true, // keeps createdAt & updatedAt
  }
);

module.exports = mongoose.model("Item", itemSchema);
