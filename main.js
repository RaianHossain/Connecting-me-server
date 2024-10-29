const customRouter = require("./router");
const express = require("express");
const checkAuth = require("./middleware/checkAuth");
require("dotenv").config();
const cors = require("cors");
const { connectDb } = require("./database/connect");

const app = express();
const router = express.Router();
app.use(cors({ credentials: true, origin: true }));
app.use(express.static(__dirname + "/public"));
app.use("/uploads", express.static("uploads"));

// /!\ Bind the router db to the app

app.use(express.json());

// This middleware will add extra information before storing
app.use(checkAuth);

// CustomRoute Middleware to Handle Extra Routes
app.use("/", customRouter);

app.use(router);

// Error handle Middleware
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  res.status(500).json({
    error: err.message,
  });
});

const start = async (port = process.env.PORT || 3000) => {
  try {
      app.mongoose = await connectDb(process.env.MONGO_STRING);
      app.listen(port, () => {
          console.log(`App listening to ${port}`);
      })
      console.log("Success");
  } catch (error) {
      console.log(error);
  }
}

start();