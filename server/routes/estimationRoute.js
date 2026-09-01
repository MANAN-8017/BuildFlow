const express = require("express");

const { previewEstimate, createEstimation, getEstimations, getEstimationById, updateEstimation, deleteEstimation } = require("../controllers/estimationController");

const estimationRouter = express.Router();

estimationRouter.post("/estimate", previewEstimate);
estimationRouter.post("/create", createEstimation);
estimationRouter.get("/", getEstimations);
estimationRouter.get("/:estimationId", getEstimationById);
estimationRouter.put("/:estimationId", updateEstimation);
estimationRouter.delete("/:estimationId", deleteEstimation);

module.exports = estimationRouter;