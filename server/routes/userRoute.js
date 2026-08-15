const express = require("express");

const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} = require("../controller/userContoller");

const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:userId", getUserById);
router.put("/:userId", updateUser);
router.delete("/:userId", deleteUser);

module.exports = router;