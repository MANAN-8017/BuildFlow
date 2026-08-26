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

        currency: {
            type: String,
            default: "INR",
            uppercase: true
        },

        paymentMode: {
            type: String,
            enum: [
                "UPI",
                "Card",
                "NetBanking",
                "Cash"
            ],
            default: null
        },

        paymentStatus: {
            type: String,
            enum: [
                "pending",
                "created",
                "authorized",
                "captured",
                "failed",
                "refunded"
            ],
            default: "pending"
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

        razorpayOrderId: {
            type: String,
            default: null,
            index: true
        },

        razorpayPaymentId: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Order = model("Order", order);

module.exports = Order;