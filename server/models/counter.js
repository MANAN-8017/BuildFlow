const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const counterSchema = new Schema({
    _id: {
        type: String,
        required: true
    },

    sequence: {
        type: Number,
        default: 0
    }
});

const Counter = model("Counter", counterSchema);

module.exports = Counter;