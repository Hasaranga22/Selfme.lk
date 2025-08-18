const express = require("express");
const router = express.Router();
const itemController = require("../Controllers/itemController");
const multer = require("multer");
const path = require("path");

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../Item_images")); // save in Item_images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// GET all items
router.get("/", itemController.getAllItems);

// POST a new item with image upload
router.post("/", upload.single("item_image"), itemController.createItem);

router.get("/:id", itemController.getItemById);
router.delete("/:id", itemController.deleteItem);

module.exports = router;
