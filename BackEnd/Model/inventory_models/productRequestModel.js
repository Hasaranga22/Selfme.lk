// productRequestModel.js
const mongoose = require("mongoose");

const productRequestSchema = new mongoose.Schema(
  {
    supplier_name: { type: String, required: true },
    product_item: { type: String, required: true },
    quantity: { type: Number, required: true },
    need_date: { type: Date, required: true },
    unit_price: { type: Number, required: true },
    total_cost: { type: Number, required: true },
    remark: { type: String },
    request_status: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ProductRequest", productRequestSchema);