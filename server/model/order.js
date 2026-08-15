const mongoose = require('mongoose');
const { Schema, model} = mongoose;

const order = new Schema(
    {
        userId: {
            type: Number,
            required: true
        },

        products: [
            {
                productId: {
                    type: Number,
                    required: true
                },

                quantity: {
                    type: Number,
                    required: true,
                    min: 1
                }
            }
        ],

        totalAmount: {
            type: Number,
            required: true,
            min: 0
        },

        paymentMode: {
            type: String,
            enum: ["UPI", "Card", "Cash", "NetBanking"],
            required: true
        },

        status: {
            type: String,
            enum: [
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled"
            ],
            default: "Processing"
        }
    },
    {
        timestamps: true
    }
);

const Order = model('Order', order);
module.exports = Order;