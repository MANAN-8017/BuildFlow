const mongoose = require('mongoose');
const { Schema, model} = mongoose;

const estimation = new Schema(
     {
        userId: {
            type: String,
            required: true
        },

        estimationId:{
            type: String,
            required: true,
            unique: true
        },

        length: {
            type: Number,
            required: true,
            min: 0
        },

        width: {
            type: Number,
            required: true,
            min: 0
        },

        height: {
            type: Number,
            required: true,
            min: 0
        },

        cement: {
            type: Number,
            default: 0,
            min: 0
        },

        sand: {
            type: Number,
            default: 0,
            min: 0
        },

        steel: {
            type: Number,
            default: 0,
            min: 0
        },

        estimatedCost: {
            type: Number,
            required: true,
            min: 0
        }
    },
    {
        timestamps: true
    }
);

const Estimation = model('Estimation', estimation);
module.exports = Estimation;