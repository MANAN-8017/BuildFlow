const Product = require("../models/product");
const { generateProductId } = require("../services/idService");

const createProduct = async (req, res) => {
    try {

        const productId = await generateProductId();

        const product = await Product.create({
            productId,
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            discount: req.body.discount
        });

        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json({products: products});
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({ productId: req.params.productId });
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndUpdate(
            {
                productId: req.params.productId
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOneAndDelete({
            productId: req.params.productId
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct };