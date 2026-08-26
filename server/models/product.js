const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const product = new Schema(
    {
        productId: {
            type: String,
            unique: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        quantity: {
            type: Number,
            default: 0,
            min: 0
        },

        discount: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

const Product = model('Product', product);
module.exports = Product;