const Cart = require("../models/cart");

const createCart = async (req, res) => {
    try {
        const cart = await Cart.create(req.body);
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getCarts = async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getCartById = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            cartId: req.params.cartId
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getCartByUserId = async (req, res) => {
    try {
        const cart = await Cart.findOne({
            userId: req.params.userId
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateCart = async (req, res) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            {
                cartId: req.params.cartId
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteCart = async (req, res) => {
    try {
        const cart = await Cart.findOneAndDelete({
            cartId: req.params.cartId
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        res.status(200).json({
            message: "Cart deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { createCart, getCarts, getCartById, getCartByUserId, updateCart, deleteCart };