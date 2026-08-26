const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const payment = new Schema(
    {
        userId: {
            type: Number,
            required: true
        },

        orderId: {
            type: String,
            required: true,
            index: true
        },

        razorpayPaymentId: {
            type: String,
            default: null,
            index: true
        },

        razorpayOrderId: {
            type: String,
            required: true,
            index: true
        },

        razorpaySignature: {
            type: String,
            default: null
        },

        amount: {
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

        receipt: {
            type: String,
            default: null
        },

        status: {
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
        }
    },
    {
        timestamps: true
    }
);

const Payment = model("Payment", payment);

module.exports = Payment;