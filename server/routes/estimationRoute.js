const express = require("express");

const { createEstimation, getEstimations, getEstimationById, updateEstimation, deleteEstimation } = require("../controller/estimationController");

const estimationRouter = express.Router();

estimationRouter.post("/create", createEstimation);
estimationRouter.get("/", getEstimations);
estimationRouter.get("/:estimationId", getEstimationById);
estimationRouter.put("/:estimationId", updateEstimation);
estimationRouter.delete("/:estimationId", deleteEstimation);

module.exports = estimationRouter;