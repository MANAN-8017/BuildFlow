const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const user = new Schema(
    {
        userId: {
            type: Number,
            unique: true
        },
        
         name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        phNo: {
            type: String
        },

        password: {
            type: String,
            required: true
        },

        address: {
            type: String
        },
    },
    {
        timestamps: true
    }
);

const User = model('User', user);
module.exports = User;