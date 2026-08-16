const express = require("express");

const routes = express.Router();

const productRouter = require("./productRoute");
const estimationRouter = require("./estimationRoute");
const orderRouter = require("./orderRoute");
const paymentRouter = require("./paymentRoute");
const cartRouter = require("./cartRoute");
const userRouter = require("./userRoute");

routes.use("/products", productRouter);
routes.use("/estimations", estimationRouter);
routes.use("/orders", orderRouter);
routes.use("/payments", paymentRouter);
routes.use("/cart", cartRouter);
routes.use("/users", userRouter);

module.exports = routes;