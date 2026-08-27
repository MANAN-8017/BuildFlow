const express = require("express");

const { verifyPayment, getPaymentById, getPaymentsByUserId, getPayments } = require("../controllers/paymentController");

const paymentRouter = express.Router();

paymentRouter.post("/verify", verifyPayment);
paymentRouter.get("/user/:userId", getPaymentsByUserId);
paymentRouter.get("/:paymentId", getPaymentById);
// Admin Access
paymentRouter.get("/", getPayments);

module.exports = paymentRouter;