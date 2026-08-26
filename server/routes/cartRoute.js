const express = require("express");

const { createCart, getCarts, getCartById, getCartByUserId, updateCart, deleteCart } = require("../controllers/cartController");

const cartRouter = express.Router();

cartRouter.post("/create", createCart);
cartRouter.get("/", getCarts);
cartRouter.get("/user/:userId", getCartByUserId);
cartRouter.get("/:cartId", getCartById);
cartRouter.put("/:cartId", updateCart);
cartRouter.delete("/:cartId", deleteCart);

module.exports = cartRouter;