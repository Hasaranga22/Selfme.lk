const mongoose = require("mongoose");

const stockOutSchema = new mongoose.Schema(
  {
    customer_id: {
      type: String, // manually entered until customer table is ready
      required: true,
    },
    items: [
      {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        item_name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }, // selling price at time of order
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["customer", "technical"], // differentiate orders
      default: "customer",
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StockOut", stockOutSchema);
