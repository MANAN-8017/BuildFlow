const User = require("../model/user");

const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findOne({
            userId: req.params.userId
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate(
            {
                userId: req.params.userId
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({
            userId: req.params.userId
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser };