const Estimation = require("../models/estimation");
const estimationService = require("../services/estimationService");
const { generateEstimationId } = require("../services/idService");

// POST /api/estimations/estimate
const previewEstimate = async (req, res) => {
    try {
        const { length, width, height, floors, buildingType } = req.body;

        const estimate = await estimationService.generateEstimate({
            length,
            width,
            height,
            floors,
            buildingType
        });

        res.status(200).json({
            success: true,
            estimate
        });
    } catch (error) {
        res.status(502).json({
            success: false,
            message: error.message
        });
    }
};

const createEstimation = async (req, res) => {
    try {
        const { length, width, height, floors, buildingType } = req.body;

        const estimationId = await generateEstimationId();

        const estimation = await estimationService.create({
            userId: req.user.userId,
            estimationId,
            length,
            width,
            height,
            floors,
            buildingType
        });

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

module.exports = { previewEstimate, createEstimation, getEstimations, getEstimationById, updateEstimation, deleteEstimation };