const Payment = require("../model/payment");

const createPayment = async (req, res) => {
    try {
        const payment = await Payment.create(req.body);
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

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
            paymentId: req.params.paymentId
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
                paymentId: req.params.paymentId
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
            paymentId: req.params.paymentId
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

module.exports = {
    createPayment,
    getPayments,
    getPaymentById,
    getPaymentsByUserId,
    updatePayment,
    deletePayment
};