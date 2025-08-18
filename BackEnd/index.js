const express = require("express");
const mongoose = require("mongoose");
const app = express();
const itemRoutes = require("./Routes/ItemRoutes");
const cors = require("cors"); // Add this line

//Middleware
app.use(cors());
app.use(express.json());
app.use("/items", itemRoutes);

mongoose
  .connect(
    "mongodb+srv://adminSelfme:P40YIFy04Am8rnDe@cluster0.4bp3tta.mongodb.net/inventoryDBs"
  )
  .then(() => console.log("Connected to Mongo DB"))
  .then(() => {
    app.listen(5000);
  })

  .catch((err) => console.log(err));
