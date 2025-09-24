const express = require("express");
const mongoose = require("mongoose");
const app = express();
const itemRoutes = require("./Routes/item_routes/ItemRoutes");
const productRequestRoutes = require("./Routes/item_routes/productRequestRoutes");
const supplierRouter = require("./Routes/item_routes/supplierRoutes");
const orderRoutes = require("./Routes/item_routes/orderRoutes");
const stockOutRoutes  = require ("./Routes/item_routes/stockOutRoutes")
const cors = require("cors");
const path = require("path");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use("/images", express.static(path.join(__dirname, "item_images")));
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Add this line

// Routes
app.use("/products", itemRoutes);
app.use("/orders", orderRoutes);
app.use("/productRequests", productRequestRoutes);
app.use("/suppliers", supplierRouter);
app.use("/stockouts", stockOutRoutes);


// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Server error:", error);
  res.status(500).json({ error: "Internal server error" });
});

// MongoDB connection
mongoose
  .connect(
    "mongodb+srv://adminSelfme:P40YIFy04Am8rnDe@cluster0.4bp3tta.mongodb.net/selfmedb"
  )
  .then(() => console.log("Connected to Mongo DB"))
  .then(() => {
    app.listen(5000, () => {
      console.log("App listening on port 5000");
    });
  })
  .catch((err) => console.log(err));
