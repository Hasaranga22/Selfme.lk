const express = require("express");
const mongoose = require("mongoose");
const app = express();
const itemRoutes = require("./Routes/ItemRoutes"); // ✅ lowercase 'i'
const cors = require("cors");
const path = require("path");

// Middleware
app.use(cors());
app.use(express.json());
app.use("/items", itemRoutes);

// Serve static files from item_images folder
app.use("/images", express.static(path.join(__dirname, "item_images")));

mongoose
  .connect(
    "mongodb+srv://adminSelfme:P40YIFy04Am8rnDe@cluster0.4bp3tta.mongodb.net/inventoryDBs"
  )
  .then(() => console.log("Connected to Mongo DB"))
  .then(() => {
    app.listen(5000);
    console.log("App listening on port 5000");
  })
  .catch((err) => console.log(err));