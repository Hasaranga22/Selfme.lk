const StockOut = require("../../Model/inventory_models/StockOutModel");
const Product = require("../../Model/inventory_models/itemModel");

// Create StockOut Order
exports.createStockOut = async (req, res) => {
  try {
    const { customer_id, items, type } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    // Calculate total
    const total = items.reduce((sum, i) => sum + i.quantity * i.price, 0);

    // Save new order
    const stockOut = new StockOut({
      customer_id,
      items,
      total,
      type,
      status: "Pending",
    });

    await stockOut.save();

    res.status(201).json(stockOut);
  } catch (err) {
    console.error("Error creating stock out:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Confirm Order (reduce stock)
exports.confirmStockOut = async (req, res) => {
  try {
    const { id } = req.params;
    const stockOut = await StockOut.findById(id);

    if (!stockOut) return res.status(404).json({ message: "Order not found" });

    if (stockOut.status === "Confirmed") {
      return res.status(400).json({ message: "Order already confirmed" });
    }

    // Reduce stock
    for (const item of stockOut.items) {
      const product = await Product.findById(item.product_id);
      if (!product) continue;

      if (product.quantity_in_stock < item.quantity) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${product.item_name}` });
      }

      product.quantity_in_stock -= item.quantity;
      await product.save();
    }

    stockOut.status = "Confirmed";
    await stockOut.save();

    res.json({ message: "Order confirmed", stockOut });
  } catch (err) {
    console.error("Error confirming stock out:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all StockOuts
exports.getAllStockOuts = async (req, res) => {
  try {
    const stockOuts = await StockOut.find().sort({ createdAt: -1 });
    res.json(stockOuts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stock outs" });
  }
};
