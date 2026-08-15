const mongoose = require('mongoose');
const {Schema, model} = mongoose;

const cart = new Schema(
     {
        userId: {
            type: Number,
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
                    default: 1,
                    min: 1
                }
            }
        ],

        totalAmount: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

const Cart = model('Cart', cart);
module.exports = Cart;