const Payment = require("../model/payment");
const paymentService = require("../services/paymentService");
const { createOrder } = require("./orderController");

const createPayment = async (req, res) => {
    try {
        const order = await paymentService.create(req.body);

        const payment = await Payment.create({
            razorpayOrderId: order.id,
            amount: order.amount / 100,
            currency: order.currency,
            receipt: order.receipt,
            status: order.status,
            userId: req.body.userId,
            paymentMode: req.body.paymentMode,
        });

        createOrder(payment, res);

        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const isValid = paymentService.verify(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        if (!isValid) {
            return res.status(400).json({
                message: "Invalid payment signature"
            });
        }

        const payment = await Payment.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            { razorpayPaymentId: razorpay_payment_id, status: "Success" },
            { new: true }
        );

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
}

const getPayments = async (req, res) => {
    try {
        const payments = await Payment.find();
        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findOne({
            razorpayPaymentId: req.params.paymentId
        });

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getPaymentsByUserId = async (req, res) => {
    try {
        const payments = await Payment.find({
            userId: req.params.userId
        });

        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updatePayment = async (req, res) => {
    try {
        const payment = await Payment.findOneAndUpdate(
            {
                razorpayPaymentId: req.params.paymentId
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findOneAndDelete({
            razorpayPaymentId: req.params.paymentId
        });

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        res.status(200).json({
            message: "Payment deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { createPayment, verifyPayment, getPayments, getPaymentById, getPaymentsByUserId, updatePayment, deletePayment };