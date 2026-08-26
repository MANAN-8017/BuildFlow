const express = require("express");

const { createUser, getUsers, getUserById, updateUser, deleteUser } = require("../controllers/userController");

const userRouter = express.Router();

userRouter.post("/create", createUser);
userRouter.get("/", getUsers);
userRouter.get("/:userId", getUserById);
userRouter.put("/:userId", updateUser);
userRouter.delete("/:userId", deleteUser);

module.exports = userRouter;