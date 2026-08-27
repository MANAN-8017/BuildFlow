const Order = require("../models/order");
const { generateOrderId } = require("../services/idService");
const paymentService = require("../services/paymentService");

const createOrder = async (req, res) => {
    try {
        const orderId = await generateOrderId();

        const razorpayOrder = await paymentService.create({
            amount: req.body.totalAmount,
            currency: req.body.currency,
            reciept: orderId
        });

        const order = await Order.create({
            orderId,
            razorpayOrderId: razorpayOrder.id,
            userId: req.body.userId,
            products: req.body.products,
            shippingAddress: req.body.shippingAddress,
            subtotal: req.body.subtotal,
            deliveryCharge: req.body.deliveryCharge,
            totalAmount: req.body.totalAmount,
            paymentStatus: razorpayOrder.status,
            orderStatus: "pending"
        });

        res.status(201).json({ success: true, order, razorpayOrder });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({
            orderId: req.params.orderId
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getOrdersByUserId = async (req, res) => {
    try {
        const orders = await Order.find({
            userId: req.params.userId
        });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateOrder = async (req, res) => {
    try {
        const order = await Order.findOneAndUpdate(
            {
                orderId: req.params.orderId
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findOneAndDelete({
            orderId: req.params.orderId
        });

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        res.status(200).json({
            message: "Order deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { createOrder, getOrders, getOrderById, getOrdersByUserId, updateOrder, deleteOrder };