const express = require("express");

const routes = express.Router();

const authRouter = require("./authRoutes");
const cartRouter = require("./cartRoute");
const estimationRouter = require("./estimationRoute");
const orderRouter = require("./orderRoute");
const paymentRouter = require("./paymentRoute");
const productRouter = require("./productRoute");
const userRouter = require("./userRoute");
const authMiddleware = require("../middleware/authMiddleware");

routes.use("/auth", authRouter);
routes.use("/cart", authMiddleware, cartRouter);
routes.use("/estimations", authMiddleware, estimationRouter);
routes.use("/orders", authMiddleware, orderRouter);
routes.use("/payments", authMiddleware, paymentRouter);
routes.use("/products", productRouter);
routes.use("/users", userRouter);

module.exports = routes;