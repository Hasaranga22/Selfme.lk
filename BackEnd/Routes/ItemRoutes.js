const express = require("express");
const router = express.Router();
const itemController = require("../Controllers/itemController");

// GET all items
router.get("/", itemController.getAllItems);

// POST a new item
router.post("/", itemController.createItem);
router.get("/:id", itemController.getItemById);
router.delete("/:id", itemController.deleteItem);

module.exports = router;
