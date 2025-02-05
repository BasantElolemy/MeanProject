const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const userRoute = require("./Routes/userRoute");
const autthenticationRoute = require("./Routes/authenticationRoute");

const categoryRoute = require("./Routes/categoryRoute");
const productRoute = require("./Routes/productRoute");
const orderRoute = require("./Routes/orderRoute");
const authorization = require("./core/Authroization/authorization");

const server = express();

server.use(cors());
server.use("*", cors());

let port = process.env.PORT || 8080;

mongoose.get("strictQuery", true);
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("conenct");
    server.listen(port, () => {});
  })
  .catch((error) => {
    console.log("Connection Error" + error);
  });

server.use(morgan("tiny"));
server.use(express.json());
server.use(autthenticationRoute);
server.use(authorization);
server.use(userRoute);
server.use(categoryRoute);
server.use(productRoute);
//server.use(orderRoute);

server.use((request, response, next) => {
  response.status(404).json({ message: "Page Not Found" });
});

server.use((error, request, response, next) => {
  let status = error.status || 500;
  response.status(status).json({ message: error + "" });
});
