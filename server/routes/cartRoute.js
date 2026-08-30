const express = require("express");

const { createCart, getCart, getCartById, updateCart, deleteCart } = require("../controllers/cartController");

const cartRouter = express.Router();

cartRouter.post("/create", createCart);
cartRouter.get("/", getCart);
cartRouter.get("/:cartId", getCartById);
cartRouter.put("/:cartId", updateCart);
cartRouter.delete("/:cartId", deleteCart);

module.exports = cartRouter;