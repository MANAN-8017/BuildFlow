const express = require("express");

const {
    createCart,
    getCarts,
    getCartById,
    getCartByUserId,
    updateCart,
    deleteCart
} = require("../controller/cartController");

const router = express.Router();

router.post("/", createCart);
router.get("/", getCarts);
router.get("/user/:userId", getCartByUserId);
router.get("/:cartId", getCartById);
router.put("/:cartId", updateCart);
router.delete("/:cartId", deleteCart);

module.exports = router;