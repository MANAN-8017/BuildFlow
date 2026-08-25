const express = require("express");

const { createPayment, verifyPayment, getPayments, getPaymentById, getPaymentsByUserId, updatePayment, deletePayment } = require("../controller/paymentController");

const paymentRouter = express.Router();

paymentRouter.post("/create", createPayment);
paymentRouter.post("/verify", verifyPayment);
paymentRouter.get("/", getPayments);
paymentRouter.get("/user/:userId", getPaymentsByUserId);
paymentRouter.get("/:paymentId", getPaymentById);
paymentRouter.put("/:paymentId", updatePayment);
paymentRouter.delete("/:paymentId", deletePayment);

module.exports = paymentRouter;