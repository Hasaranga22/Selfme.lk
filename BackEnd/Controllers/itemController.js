const Item = require("../Model/itemModel");

// Get all items
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new item
const createItem = async (req, res, next) => {
  const {
    serial_number,
    item_name,
    category,
    quantity_in_stock,
    supplier_id,
    min_stock_level,
  } = req.body;

  let newItem;

  try {
    newItem = new Item({
      serial_number,
      item_name,
      item_image: req.file ? req.file.filename : null, // Save only the filename
      category,
      quantity_in_stock,
      supplier_id,
      min_stock_level,
    });

    await newItem.save();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error saving item", error: err });
  }

  if (!newItem) {
    return res.status(400).json({ message: "Unable to add item" });
  }

  return res
    .status(201)
    .json({ message: "Item created successfully", item: newItem });
};

// Get item by ID
const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete item by ID
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllItems,
  createItem,
  getItemById,
  deleteItem,
};
