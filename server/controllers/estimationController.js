const Estimation = require("../models/estimation");
const estimationService = require("../services/estimationService");

const createEstimation = async (req, res) => {
    try {
        const estimation = await estimationService.create(req.body);
        res.status(201).json(estimation);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getEstimations = async (req, res) => {
    try {
        const estimations = await Estimation.find();
        res.status(200).json(estimations);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getEstimationById = async (req, res) => {
    try {
        const estimation = await Estimation.findOne({
            estimationId: req.params.estimationId
        });

        if (!estimation) {
            return res.status(404).json({
                message: "Estimation not found"
            });
        }

        res.status(200).json(estimation);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const updateEstimation = async (req, res) => {
    try {
        const estimation = await Estimation.findOneAndUpdate(
            {
                estimationId: req.params.estimationId
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!estimation) {
            return res.status(404).json({
                message: "Estimation not found"
            });
        }

        res.status(200).json(estimation);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const deleteEstimation = async (req, res) => {
    try {
        const estimation = await Estimation.findOneAndDelete({
            estimationId: req.params.estimationId
        });

        if (!estimation) {
            return res.status(404).json({
                message: "Estimation not found"
            });
        }

        res.status(200).json({
            message: "Estimation deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = { createEstimation, getEstimations, getEstimationById, updateEstimation, deleteEstimation };