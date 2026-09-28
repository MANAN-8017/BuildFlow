const Cart = require("../models/cart");
const { generateCartId } = require("../services/idService");

const createCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        const existingCart = await Cart.findOne({ userId });

        if (existingCart) {
            return res.status(200).json({
                success: true,
                cart: existingCart
            });
        }

        const cartId = await generateCartId();

        const cart = await Cart.create({
            cartId,
            userId,
            products: req.body.products || []
        });

        return res.status(201).json({
            success: true,
            cart
        });
    } catch (error) {
        console.error("Create cart error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getCart = async (req, res) => {
    try {
        const userId = req.user.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User information missing from token"
            });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(200).json({
                success: true,
                cart: {
                    cartId: null,
                    userId,
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
            cartId: req.params.cartId,
            userId: req.user.userId
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        return res.status(200).json({
            success: true,
            cart
        });
    } catch (error) {
        console.error("Get cart by ID error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateCart = async (req, res) => {
    try {
        const products = Array.isArray(req.body.products)
            ? req.body.products
            : [];

        const cart = await Cart.findOneAndUpdate(
            {
                cartId: req.params.cartId,
                userId: req.user.userId
            },
            {
                products
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        return res.status(200).json({
            success: true,
            cart
        });
    } catch (error) {
        console.error("Update cart error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteCart = async (req, res) => {
    try {
        const cart = await Cart.findOneAndDelete({
            cartId: req.params.cartId,
            userId: req.user.userId
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cart deleted successfully"
        });
    } catch (error) {
        console.error("Delete cart error:", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createCart,
    getCart,
    getCartById,
    updateCart,
    deleteCart
};