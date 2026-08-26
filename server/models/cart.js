const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const cart = new Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true
        },

        cartId: {
            type: String,
            required: true,
            unique: true
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
                    min: 1,
                    default: 1
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

const Cart = model("Cart", cart);

module.exports = Cart;