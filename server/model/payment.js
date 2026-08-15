const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const payment = new Schema(
    {
        userId: {
            type: Number,
            required: true
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        paymentMode: {
            type: String,
            enum: ["UPI", "Card", "NetBanking", "Cash"],
            required: true
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Success",
                "Failed",
                "Refunded"
            ],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

const Payment = model('Payment', payment);
module.exports = Payment;