const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const order = new Schema(
    {
        userId: {
            type: String,
            required: true
        },

        orderId: {
            type: String,
            required: true,
            unique: true,
            index: true
        },

        razorpayOrderId: {
            type: String,
            default: null,
            index: true
        },

        products: [
            {
                productId: {
                    type: String,
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                },

                unitPrice: {
                    type: Number,
                    required: true,
                    min: 0
                },

                totalPrice: {
                    type: Number,
                    required: true,
                    min: 0
                }
            }
        ],

        shippingAddress: {
            name: {
                type: String,
                required: true
            },

            phone: {
                type: String,
                required: true
            },

            address: {
                type: String,
                required: true
            },

            city: {
                type: String,
                required: true
            },

            state: {
                type: String,
                required: true
            },

            pincode: {
                type: String,
                required: true
            }
        },

        subtotal: {
            type: Number,
            required: true,
            min: 0
        },

        deliveryCharge: {
            type: Number,
            default: 0,
            min: 0
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        paymentStatus: {
            type: String,
            enum: [
                "created",
                "authorized",
                "captured",
                "refunded",
                "failed"
            ],
            default: "created"
        },

        orderStatus: {
            type: String,
            enum: [
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled"
            ],
            default: "pending"
        },
    },
    {
        timestamps: true
    }
);

const Order = model("Order", order);

module.exports = Order;