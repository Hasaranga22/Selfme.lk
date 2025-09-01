const Item = require("../Model/itemModel");
const fs = require("fs");
const path = require("path");

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
const createItem = async (req, res) => {
  try {
    const {
      serial_number,
      item_name,
      category,
      quantity_in_stock,
      supplier_id,
      min_stock_level,
    } = req.body;

    const newItem = new Item({
      serial_number,
      item_name,
      item_image: req.file ? req.file.filename : null,
      category,
      quantity_in_stock: Number(quantity_in_stock),
      supplier_id,
      min_stock_level: Number(min_stock_level),
    });

    const savedItem = await newItem.save();
    res.status(201).json({
      message: "Item created successfully",
      item: savedItem,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Serial number already exists",
        field: "serial_number",
      });
    }
    res.status(500).json({
      message: "Error creating item",
      error: err.message,
    });
  }
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

// Update item by ID
const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const file = req.file;

    // Find the existing item
    const existingItem = await Item.findById(id);
    if (!existingItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Handle image update if new file was uploaded
    if (file) {
      // Delete old image if it exists
      if (existingItem.item_image) {
        const oldImagePath = path.join(
          __dirname,
          "../public/images",
          existingItem.item_image
        );
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      updates.item_image = file.filename;
    }

    // Convert numeric fields to numbers
    if (updates.quantity_in_stock) {
      updates.quantity_in_stock = Number(updates.quantity_in_stock);
    }
    if (updates.min_stock_level) {
      updates.min_stock_level = Number(updates.min_stock_level);
    }

    // Update all fields
    const updatedItem = await Item.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return res
        .status(404)
        .json({ message: "Item not found after update attempt" });
    }

    res.status(200).json({
      message: "Item updated successfully",
      item: updatedItem,
    });
  } catch (err) {
    console.error("Update error:", err);
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Serial number already exists",
        field: "serial_number",
      });
    }
    res.status(500).json({
      message: "Error updating item",
      error: err.message,
    });
  }
};

// Delete item by ID
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Delete associated image
    if (item.item_image) {
      const imagePath = path.join(
        __dirname,
        "../public/images",
        item.item_image
      );
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Item.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllItems,
  createItem,
  getItemById,
  updateItem,
  deleteItem,
};
