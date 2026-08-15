const express = require("express");

const {
    createOrder,
    getOrders,
    getOrderById,
    getOrdersByUserId,
    updateOrder,
    deleteOrder
} = require("../controller/orderController");

const router = express.Router();

router.post("/", createOrder);
router.get("/", getOrders);
router.get("/user/:userId", getOrdersByUserId)
router.get("/:orderId", getOrderById);
router.put("/:orderId", updateOrder);
router.delete("/:orderId", deleteOrder);

module.exports = router;