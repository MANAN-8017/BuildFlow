const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const payment = new Schema(
    {
        userId: {
            type: Number,
            required: true
        },

        razorpayPaymentId:{
            type: String,
            default: null
        },

        razorpayOrderId:{
            type: String,
            default: null
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        paymentMode: {
            type: String,
            enum: ["UPI", "Card", "NetBanking", "Cash"],
            required: true
        },

        receipt: {
            type: String,
            default: null
        },

        currency: {
            type: String,
            default: "INR"
        },

        status: {
            type: String,
            enum: [
                "created",
                "authorized",
                "captured",
                "refunded",
                "failed",
            ],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

const Payment = model('Payment', payment);
module.exports = Payment;