const express = require("express");

const { createOrder, getOrders, getOrderById, getOrdersByUserId, updateOrder, deleteOrder } = require("../controller/orderController");

const orderRouter = express.Router();

orderRouter.post("/create", createOrder);
orderRouter.get("/", getOrders);
orderRouter.get("/user/:userId", getOrdersByUserId);
orderRouter.get("/:orderId", getOrderById);
orderRouter.put("/:orderId", updateOrder);
orderRouter.delete("/:orderId", deleteOrder);

module.exports = orderRouter;