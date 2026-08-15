const express = require("express");

const {
    createEstimation,
    getEstimations,
    getEstimationById,
    updateEstimation,
    deleteEstimation
} = require("../controller/estimationController");

const router = express.Router();

router.post("/", createEstimation);
router.get("/", getEstimations);
router.get("/:estimationId", getEstimationById);
router.put("/:estimationId", updateEstimation);
router.delete("/:estimationId", deleteEstimation);

module.exports = router;