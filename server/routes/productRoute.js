const express = require("express");

const { createProduct, getProducts, getProductById, updateProduct, deleteProduct } = require("../controller/productController");

const productRouter = express.Router();

productRouter.post("/create", createProduct);
productRouter.get("/", getProducts);
productRouter.get("/:productId", getProductById);
productRouter.put("/:productId", updateProduct);
productRouter.delete("/:productId", deleteProduct);

module.exports = productRouter;