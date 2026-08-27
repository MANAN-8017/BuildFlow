const Payment = require("../models/payment");
const Order = require("../models/order");
const paymentService = require("../services/paymentService");

const verifyPayment = async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

        const isValid = paymentService.verify( razorpayOrderId, razorpayPaymentId, razorpaySignature );

        if (!isValid) {
            return res.status(400).json({ success: false, message: "Invalid payment signature" });
        }

        const order = await Order.findOne({ razorpayOrderId });

        if(!order){
            return res.status().json({ success: false, messgae: "Failed to find order"});
        }

        const payment = await Payment.create({
            userId: order.userId,
            orderId: order.orderId,
            razorpayOrderId: razorpayOrderId,
            razorpayPaymentId: razorpayPaymentId, 
            razorpaySignature: razorpaySignature,
            amount: order.totalAmount,
            currency: req.body.currency,
            status: "captured"
        });

        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not created" });
        }

        const updateOrder = await Order.findOneAndUpdate(
            { razorpayOrderId },
            { paymentStatus: payment.status, orderStatus: "processing" },
            { returnDocument: "after", runValidators: true }
        );

        if(!updateOrder){
            return res.status().json({ success: false, messgae: "Failed to update payment status in order"});
        }

        res.status(200).json({ success: true, message: "Payment verified successfully", payment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findOne({ razorpayPaymentId: req.params.paymentId });

        if (!payment) {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }

        res.status(200).json({ success: true, payment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getPaymentsByUserId = async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.params.userId });

        res.status(200).json({ success: true, payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin Access
const getPayments = async (req, res) => {
    try {
        const payments = await Payment.find();
        res.status(200).json({ success: true, payments });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { verifyPayment, getPaymentById, getPaymentsByUserId, getPayments };