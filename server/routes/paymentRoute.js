const express = require("express");

const {
    createPayment,
    getPayments,
    getPaymentById,
    getPaymentsByUserId,
    updatePayment,
    deletePayment
} = require("../controller/paymentController");

const router = express.Router();

router.post("/", createPayment);
router.get("/", getPayments);
router.get("/user/:userId", getPaymentsByUserId);
router.get("/:paymentId", getPaymentById);
router.put("/:paymentId", updatePayment);
router.delete("/:paymentId", deletePayment);

module.exports = router;