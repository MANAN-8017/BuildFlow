const Order = require("../models/order");
const { generateOrderId } = require("../services/idService");
const paymentService = require("../services/paymentService");

const createOrder = async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            products,
            shippingAddress,
            subtotal,
            deliveryCharge,
            totalAmount,
            currency
        } = req.body;

        if (!products || !products.length) {
            return res.status(400).json({
                success: false,
                message: "Order must contain at least one product."
            });
        }

        if (!shippingAddress) {
            return res.status(400).json({
                success: false,
                message: "Shipping address is required."
            });
        }

        const orderId = await generateOrderId();

        const razorpayOrder = await paymentService.create({
            amount: totalAmount,
            currency: currency || "INR",
            receipt: orderId
        });

        const order = await Order.create({
            orderId,
            razorpayOrderId: razorpayOrder.id,
            userId,
            products,
            shippingAddress,
            subtotal,
            deliveryCharge,
            totalAmount,
            paymentStatus: razorpayOrder.status,
            orderStatus: "pending"
        });

        return res.status(201).json({
            success: true,
            order,
            razorpayOrder
        });
    } catch (error) {
        console.error("Create order error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
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

module.exports = {
    createOrder,
    getOrders,
    getOrderById,
    getOrdersByUserId,
    updateOrder,
    deleteOrder
};