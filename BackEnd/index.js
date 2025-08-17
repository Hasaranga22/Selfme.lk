const express = require("express");
const mongoose = require("mongoose");
const app = express();

//Middleware
app.use("/", (req, res, next) => {
  res.send("It is working");
});

mongoose
  .connect(
    "mongodb+srv://adminSelfme:P40YIFy04Am8rnDe@cluster0.4bp3tta.mongodb.net/"
  )
  .then(() => console.log("Connected to Mongo DB"))
  .then(() => {
    app.listen(5000);
  })

  .catch((err) => console.log(err));
