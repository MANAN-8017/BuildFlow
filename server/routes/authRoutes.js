const express = require("express");

const { login, register, me } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const authRouter = express.Router();

const x =  () => {
    console.log("x");
}
authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.get("/me", authMiddleware, me);

module.exports = authRouter;