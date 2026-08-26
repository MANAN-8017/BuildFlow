const mongoose = require('mongoose');
const { Schema, model} = mongoose;

const order = new Schema(
    {
        userId: {
            type: Number,
            required: true
        },

        orderId:{
            type: String,
            required: true,
            unique: true
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
                "processing",
                "shipped",
                "delivered",
                "cancelled"
            ],
            default: "processing"
        }
    },
    {
        timestamps: true
    }
);

const Order = model('Order', order);
module.exports = Order;