const Cart = require("../models/cart");
const { generateCartId } = require("../services/idService");

const createCart = async (req, res) => {

    try {

        const cartId = await generateCartId();

        const cart = await Cart.create({
            cartId,
            userId: req.user.userId,
            products: req.body.products || []
        });

        return res.status(201).json({
            success: true,
            cart
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }
};

const getCart = async (req, res) => {
    try {

        if (!req.user || !req.user.userId) {
            return res.status(401).json({
                success: false,
                message: "User information missing from token"
            });
        }

        const cart = await Cart.findOne({
            userId: req.user.userId
        });

        if (!cart) {
            return res.status(200).json({
                success: true,
                cart: {
                    cartId: null,
                    userId: req.user.userId,
                    products: []
                }
            });
        }

        return res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {

        console.error("Get cart error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch cart"
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

const updateCart = async (req, res) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            {
                cartId: req.params.cartId,
                userId: req.params.userId
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
            cartId: req.params.cartId,
            userId: req.params.userId
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

module.exports = { createCart, getCart, getCartById, updateCart, deleteCart };