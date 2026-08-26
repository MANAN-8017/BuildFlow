const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const user = new Schema(
    {
        userId: {
            type: String,
            unique: true,
            required: true,
            index: true
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

        phone: {
            type: String,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        address: {
            street: {
                type: String,
                trim: true
            },

            city: {
                type: String,
                trim: true
            },

            state: {
                type: String,
                trim: true
            },

            pincode: {
                type: String,
                trim: true
            }
        }
    },
    {
        timestamps: true
    }
);

const User = model("User", user);

module.exports = User;